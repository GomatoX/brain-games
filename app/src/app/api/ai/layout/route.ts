import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface LayoutWord {
  word: string;
  clue: string;
  main_word_index?: number;
}

/**
 * Minimal crossword layout engine — runs server-side.
 * Ported from games/src/lib/crosswordLayout.js (the proven algorithm).
 * Generates valid, dense crossword layouts with guaranteed correct intersections.
 */

// ─── Seeded RNG ─────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Grid helpers ───────────────────────────────────────
type Grid = Record<string, string>;
type Ref = {
  word: string;
  x: number;
  y: number;
  dir: string;
  clue: string;
  main_word_index?: number;
};

function placeWord(
  grid: Grid,
  refs: Ref[],
  word: string,
  x: number,
  y: number,
  dir: string,
  clue: string,
  mainWordIndex?: number,
) {
  for (let i = 0; i < word.length; i++) {
    const cx = dir === "across" ? x + i : x;
    const cy = dir === "down" ? y + i : y;
    grid[`${cx},${cy}`] = word[i];
  }
  refs.push({ word, x, y, dir, clue, main_word_index: mainWordIndex });
}

function removeWord(grid: Grid, refs: Ref[], word: string) {
  const idx = refs.findIndex((r) => r.word === word);
  if (idx === -1) return;
  const ref = refs[idx];
  for (let i = 0; i < word.length; i++) {
    const cx = ref.dir === "across" ? ref.x + i : ref.x;
    const cy = ref.dir === "down" ? ref.y + i : ref.y;
    // Only remove if no other word uses this cell
    const otherUses = refs.some(
      (r, ri) =>
        ri !== idx &&
        r.word.split("").some((_, li) => {
          const rx = r.dir === "across" ? r.x + li : r.x;
          const ry = r.dir === "down" ? r.y + li : r.y;
          return rx === cx && ry === cy;
        }),
    );
    if (!otherUses) delete grid[`${cx},${cy}`];
  }
  refs.splice(idx, 1);
}

function getGridBounds(grid: Grid) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (const key of Object.keys(grid)) {
    const [x, y] = key.split(",").map(Number);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** Check if word can be placed. Returns intersection count or -1 if invalid. */
function checkPlacement(
  grid: Grid,
  word: string,
  sx: number,
  sy: number,
  dir: string,
): number {
  let intersections = 0;
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  for (let i = 0; i < word.length; i++) {
    const x = sx + dx * i;
    const y = sy + dy * i;
    const cell = grid[`${x},${y}`];

    if (cell) {
      if (cell === word[i]) {
        intersections++;
      } else {
        return -1; // letter conflict
      }
    }
  }

  // Check cell before & after word
  const bx = sx - dx,
    by = sy - dy;
  if (grid[`${bx},${by}`]) return -1;
  const ax = sx + dx * word.length,
    ay = sy + dy * word.length;
  if (grid[`${ax},${ay}`]) return -1;

  return intersections;
}

/** Score a placement for density. Higher = better. */
function densityScore(
  grid: Grid,
  word: string,
  x: number,
  y: number,
  dir: string,
): number {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  let touching = 0;
  for (let i = 0; i < word.length; i++) {
    const cx = x + dx * i;
    const cy = y + dy * i;
    // Count filled neighbors
    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (grid[`${nx},${ny}`]) touching++;
    }
  }

  // Penalty for expanding the bounding box
  const bounds = getGridBounds(grid);
  let expansion = 0;
  for (let i = 0; i < word.length; i++) {
    const cx = x + dx * i;
    const cy = y + dy * i;
    if (cx < bounds.minX || cx > bounds.maxX) expansion++;
    if (cy < bounds.minY || cy > bounds.maxY) expansion++;
  }

  // Distance from center of mass
  const keys = Object.keys(grid);
  if (keys.length === 0) return 50;
  let comX = 0,
    comY = 0;
  for (const k of keys) {
    const [kx, ky] = k.split(",").map(Number);
    comX += kx;
    comY += ky;
  }
  comX /= keys.length;
  comY /= keys.length;
  const wordMidX = x + (dx * word.length) / 2;
  const wordMidY = y + (dy * word.length) / 2;
  const distFromCom = Math.abs(wordMidX - comX) + Math.abs(wordMidY - comY);

  return touching * 2000 - expansion * 100 - distFromCom * 5 + 50;
}

/** Find best placements for a word. */
function findPlacements(
  grid: Grid,
  word: string,
  placed: Ref[],
): { x: number; y: number; dir: string; score: number }[] {
  const results: { x: number; y: number; dir: string; score: number }[] = [];
  const seen = new Set<string>();

  // Phase 1: intersection-based
  for (const ref of placed) {
    for (const dir of ["across", "down"] as const) {
      if (ref.dir === dir) continue;
      for (let ri = 0; ri < ref.word.length; ri++) {
        for (let wi = 0; wi < word.length; wi++) {
          if (ref.word[ri] !== word[wi]) continue;
          const sx =
            dir === "across"
              ? ref.x - wi + (ref.dir === "across" ? ri : 0)
              : ref.x + (ref.dir === "across" ? ri : 0);
          const sy =
            dir === "down"
              ? ref.y - wi + (ref.dir === "down" ? ri : 0)
              : ref.y + (ref.dir === "down" ? ri : 0);
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            results.push({
              x: sx,
              y: sy,
              dir,
              score: densityScore(grid, word, sx, sy, dir) + ix * 8000,
            });
          }
        }
      }
    }
  }

  // Phase 1b: brute-force grid scan for extra intersections
  if (Object.keys(grid).length > 0) {
    const bounds = getGridBounds(grid);
    for (const dir of ["across", "down"] as const) {
      const dx = dir === "across" ? 1 : 0;
      const dy = dir === "down" ? 1 : 0;
      for (
        let sy = bounds.minY - word.length;
        sy <= bounds.maxY + word.length;
        sy++
      ) {
        for (
          let sx = bounds.minX - word.length;
          sx <= bounds.maxX + word.length;
          sx++
        ) {
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);
          // Quick pre-check: does this word even overlap the grid?
          let overlaps = false;
          for (let i = 0; i < word.length; i++) {
            if (grid[`${sx + dx * i},${sy + dy * i}`]) {
              overlaps = true;
              break;
            }
          }
          if (!overlaps) continue;
          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            results.push({
              x: sx,
              y: sy,
              dir,
              score: densityScore(grid, word, sx, sy, dir) + ix * 8000,
            });
          }
        }
      }
    }
  }

  // Phase 2: no-intersection fallback (adjacent to grid boundary)
  if (results.length === 0) {
    const bounds = getGridBounds(grid);
    const margin = 1;
    for (const dir of ["across", "down"] as const) {
      for (
        let sy = bounds.minY - word.length - margin;
        sy <= bounds.maxY + margin + 1;
        sy++
      ) {
        for (
          let sx = bounds.minX - word.length - margin;
          sx <= bounds.maxX + margin + 1;
          sx++
        ) {
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix >= 0) {
            results.push({
              x: sx,
              y: sy,
              dir,
              score: densityScore(grid, word, sx, sy, dir),
            });
          }
        }
      }
    }
  }

  // Direction bonus: favor minority direction
  if (results.length > 0) {
    const acrossCount = placed.filter((p) => p.dir === "across").length;
    const downCount = placed.filter((p) => p.dir === "down").length;
    const dirDiff = Math.abs(acrossCount - downCount);
    if (dirDiff > 0) {
      const minority = acrossCount < downCount ? "across" : "down";
      for (const r of results) {
        if (r.dir === minority) r.score += 3000 * dirDiff;
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

/** Backtracking solver */
function solve(
  grid: Grid,
  refs: Ref[],
  remaining: { word: string; clue: string; main_word_index?: number }[],
  idx: number,
  placed: Ref[],
  deadline: number,
): boolean {
  if (idx >= remaining.length) return true;
  if (Date.now() > deadline) return false;

  const entry = remaining[idx];
  const candidates = findPlacements(grid, entry.word, placed);
  const limit = Math.min(candidates.length, 5);

  for (let c = 0; c < limit; c++) {
    const { x, y, dir } = candidates[c];
    placeWord(
      grid,
      refs,
      entry.word,
      x,
      y,
      dir,
      entry.clue,
      entry.main_word_index,
    );
    placed.push({
      word: entry.word,
      x,
      y,
      dir,
      clue: entry.clue,
      main_word_index: entry.main_word_index,
    });

    if (solve(grid, refs, remaining, idx + 1, placed, deadline)) return true;

    placed.pop();
    removeWord(grid, refs, entry.word);
  }
  return false;
}

/** Generate a single layout with a given seed */
function generateLayout(
  words: { word: string; clue: string; main_word_index?: number }[],
  seedHint: number,
) {
  const seed = seedHint;
  const random = mulberry32(seed);
  const upper = words.map((w) => ({
    ...w,
    word: w.word.toUpperCase(),
  }));

  let shuffled: typeof upper;
  if (seed % 2 === 0) {
    shuffled = seededShuffle([...upper], random);
  } else {
    shuffled = [...upper].sort((a, b) => b.word.length - a.word.length);
    // Shuffle same-length groups
    let i = 0;
    while (i < shuffled.length) {
      let j = i;
      while (
        j < shuffled.length &&
        shuffled[j].word.length === shuffled[i].word.length
      )
        j++;
      if (j - i > 1) {
        const group = shuffled.slice(i, j);
        seededShuffle(group, random);
        for (let k = 0; k < group.length; k++) shuffled[i + k] = group[k];
      }
      i = j;
    }
  }

  const grid: Grid = {};
  const refs: Ref[] = [];
  const placed: Ref[] = [];

  // Place first word
  const first = shuffled[0];
  const startDir = seed % 2 === 0 ? "across" : "down";
  placeWord(
    grid,
    refs,
    first.word,
    0,
    0,
    startDir,
    first.clue,
    first.main_word_index,
  );
  placed.push({
    word: first.word,
    x: 0,
    y: 0,
    dir: startDir,
    clue: first.clue,
    main_word_index: first.main_word_index,
  });

  // Backtracking
  const remaining = shuffled.slice(1);
  const deadline = Date.now() + 300;
  solve(grid, refs, remaining, 0, placed, deadline);

  // Greedy fallback
  const placedWords = new Set(placed.map((p) => p.word));
  for (const entry of shuffled) {
    if (placedWords.has(entry.word)) continue;
    const candidates = findPlacements(grid, entry.word, placed);
    if (candidates.length > 0) {
      const best = candidates[0];
      placeWord(
        grid,
        refs,
        entry.word,
        best.x,
        best.y,
        best.dir,
        entry.clue,
        entry.main_word_index,
      );
      placed.push({
        word: entry.word,
        x: best.x,
        y: best.y,
        dir: best.dir,
        clue: entry.clue,
        main_word_index: entry.main_word_index,
      });
      placedWords.add(entry.word);
    }
  }

  // Normalize to 0-based
  const bounds = getGridBounds(grid);
  for (const p of placed) {
    p.x -= bounds.minX;
    p.y -= bounds.minY;
  }

  const w = bounds.maxX - bounds.minX + 1;
  const h = bounds.maxY - bounds.minY + 1;
  const area = w * h;
  const letterCount = Object.keys(grid).length;
  const density = letterCount / area;

  const acrossCount = placed.filter((p) => p.dir === "across").length;
  const downCount = placed.filter((p) => p.dir === "down").length;
  const dirBalance = Math.abs(acrossCount - downCount);

  return {
    placedWords: placed,
    wordsPlaced: placed.length,
    totalWords: words.length,
    success: placed.length === words.length,
    density,
    area,
    dirBalance,
    seed,
    gridWidth: w,
    gridHeight: h,
  };
}

/** Run the optimizer — tries many seeds, picks best layout */
function generateLayoutOptimized(
  words: { word: string; clue: string; main_word_index?: number }[],
  attempts = 200,
) {
  let bestLayout: ReturnType<typeof generateLayout> | null = null;
  let bestScore = -Infinity;
  const overallDeadline = Date.now() + 10000;

  for (let i = 0; i < attempts; i++) {
    if (Date.now() > overallDeadline) break;

    const layout = generateLayout(words, i + 1);

    const balancePenalty = layout.dirBalance > 4 ? -50000 : 0;
    const score =
      layout.wordsPlaced * 10000 +
      layout.density * 5000 -
      layout.area * 3 +
      balancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }

    if (layout.success && layout.density > 0.55 && layout.dirBalance <= 4)
      break;
  }

  return bestLayout!;
}

// ─── API Route ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const words: LayoutWord[] = body.words;

    if (!words?.length || words.length < 2) {
      return NextResponse.json(
        { error: "At least 2 words are required" },
        { status: 400 },
      );
    }

    const layout = generateLayoutOptimized(words);

    const result = layout.placedWords.map((p) => {
      const original = words.find(
        (w) => w.word.toUpperCase() === p.word.toUpperCase(),
      );
      return {
        word: p.word,
        clue: p.clue || original?.clue || "",
        main_word_index: p.main_word_index ?? original?.main_word_index,
        x: p.x,
        y: p.y,
        direction: p.dir,
      };
    });

    return NextResponse.json({
      words: result,
      valid: true,
      stats: {
        density: Math.round(layout.density * 100),
        balance: layout.dirBalance,
        area: layout.area,
        wordsPlaced: layout.wordsPlaced,
        totalWords: layout.totalWords,
        seed: layout.seed,
      },
    });
  } catch (err) {
    console.error("Layout generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate layout" },
      { status: 500 },
    );
  }
}
