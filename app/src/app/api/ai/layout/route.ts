import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface LayoutWord {
  word: string;
  clue: string;
  main_word_index?: number;
}

/**
 * Crossword Layout Engine v12 (Server-side TypeScript port)
 *
 * Generates layouts that follow real crossword rules:
 * 1. Every word must intersect at least one other word
 * 2. Intersections must be perpendicular with matching letters
 * 3. No parallel adjacency — words in the same direction must not touch side-by-side
 * 4. No word extensions — cells before/after a word must be empty
 * 5. Balanced across/down distribution
 */

// ─── Seeded RNG ─────────────────────────────────────────
type Grid = Record<string, string>;
type RefCount = Record<string, number>;
type Placed = {
  word: string;
  x: number;
  y: number;
  dir: string;
  clue: string;
  main_word_index?: number;
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Grid helpers ───────────────────────────────────────

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
  return minX === Infinity
    ? { minX: 0, minY: 0, maxX: 0, maxY: 0 }
    : { minX, minY, maxX, maxY };
}

function placeWord(
  grid: Grid,
  refs: RefCount,
  word: string,
  x: number,
  y: number,
  dir: string,
) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    grid[key] = word[i];
    refs[key] = (refs[key] || 0) + 1;
  }
}

function removeWord(
  grid: Grid,
  refs: RefCount,
  word: string,
  x: number,
  y: number,
  dir: string,
) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    refs[key]--;
    if (refs[key] <= 0) {
      delete grid[key];
      delete refs[key];
    }
  }
}

// ─── Placement Validation (strict crossword rules) ──────

/**
 * Validate placement. Returns intersection count (≥1 for non-first words)
 * or -1 if invalid.
 *
 * Rules:
 * 1. Bookend — cells before start and after end must be empty
 * 2. Intersection — existing cells must match letter, must be perpendicular crossing
 * 3. Parallel adjacency — non-intersection cells must have empty perpendicular neighbors
 */
function checkPlacement(
  grid: Grid,
  word: string,
  sx: number,
  sy: number,
  dir: string,
): number {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  const pdx = dir === "across" ? 0 : 1;
  const pdy = dir === "across" ? 1 : 0;

  // Rule 1: Bookend
  if (grid[`${sx - dx},${sy - dy}`]) return -1;
  if (grid[`${sx + word.length * dx},${sy + word.length * dy}`]) return -1;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const x = sx + i * dx;
    const y = sy + i * dy;
    const key = `${x},${y}`;
    const existing = grid[key];

    if (existing) {
      if (existing !== word[i]) return -1;

      // Ensure perpendicular crossing, not parallel overlap
      const prevAlongKey = `${x - dx},${y - dy}`;
      const nextAlongKey = `${x + dx},${y + dy}`;
      if (i > 0 && grid[prevAlongKey] === word[i - 1]) return -1;
      if (i < word.length - 1 && grid[nextAlongKey] === word[i + 1]) return -1;

      intersections++;
    } else {
      // Rule 3: Side adjacency check for new cells
      if (grid[`${x + pdx},${y + pdy}`]) return -1;
      if (grid[`${x - pdx},${y - pdy}`]) return -1;
    }
  }

  return intersections;
}

// ─── Placement Scoring ──────────────────────────────────

function scorePlacement(
  grid: Grid,
  word: string,
  x: number,
  y: number,
  dir: string,
  intersections: number,
): number {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  // Grid expansion penalty
  const bounds = getGridBounds(grid);
  let nMinX = bounds.minX,
    nMinY = bounds.minY,
    nMaxX = bounds.maxX,
    nMaxY = bounds.maxY;
  for (let i = 0; i < word.length; i++) {
    const cx = x + i * dx;
    const cy = y + i * dy;
    nMinX = Math.min(nMinX, cx);
    nMinY = Math.min(nMinY, cy);
    nMaxX = Math.max(nMaxX, cx);
    nMaxY = Math.max(nMaxY, cy);
  }
  const oldArea =
    (bounds.maxX - bounds.minX + 1) * (bounds.maxY - bounds.minY + 1);
  const newArea = (nMaxX - nMinX + 1) * (nMaxY - nMinY + 1);
  const expansion = newArea - oldArea;

  // Centre-of-mass proximity
  const keys = Object.keys(grid);
  let comX = 0,
    comY = 0;
  for (const k of keys) {
    const [kx, ky] = k.split(",").map(Number);
    comX += kx;
    comY += ky;
  }
  comX /= keys.length || 1;
  comY /= keys.length || 1;

  let distFromCom = 0;
  for (let i = 0; i < word.length; i++) {
    const cx = x + i * dx;
    const cy = y + i * dy;
    if (!grid[`${cx},${cy}`]) {
      distFromCom += Math.abs(cx - comX) + Math.abs(cy - comY);
    }
  }

  return intersections * 5000 - expansion * 100 - distFromCom * 10;
}

// ─── Find Valid Placements ──────────────────────────────

function getDirectionStats(placed: Placed[]) {
  let acrossN = 0;
  let downN = 0;
  for (const p of placed) {
    if (p.dir === "across") acrossN++;
    else downN++;
  }
  return {
    minorityDir: acrossN <= downN ? "across" : "down",
    imbalance: Math.abs(acrossN - downN),
  };
}

function findPlacements(
  grid: Grid,
  word: string,
  placed: Placed[],
): { x: number; y: number; dir: string; score: number }[] {
  const results: { x: number; y: number; dir: string; score: number }[] = [];
  const seen = new Set<string>();
  const { minorityDir, imbalance } = getDirectionStats(placed);

  // Phase 1: intersection-based
  for (const ref of placed) {
    const pw = ref.word;
    const pd = ref.dir;
    for (let pi = 0; pi < pw.length; pi++) {
      for (let wi = 0; wi < word.length; wi++) {
        if (pw[pi] !== word[wi]) continue;

        const tx = pd === "across" ? ref.x + pi : ref.x;
        const ty = pd === "across" ? ref.y : ref.y + pi;

        for (const dir of ["across", "down"] as const) {
          if (dir === pd) continue;

          const sx = dir === "across" ? tx - wi : tx;
          const sy = dir === "down" ? ty - wi : ty;
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            const dirBonus = dir === minorityDir ? 2000 * imbalance : 0;
            results.push({
              x: sx,
              y: sy,
              dir,
              score: scorePlacement(grid, word, sx, sy, dir, ix) + dirBonus,
            });
          }
        }
      }
    }
  }

  // Phase 2: brute-force grid scan for multi-intersection positions
  if (Object.keys(grid).length > 0) {
    const bounds = getGridBounds(grid);
    for (const dir of ["across", "down"] as const) {
      const sxMin = bounds.minX - (dir === "across" ? word.length : 1);
      const sxMax = bounds.maxX + (dir === "across" ? 1 : 1);
      const syMin = bounds.minY - (dir === "down" ? word.length : 1);
      const syMax = bounds.maxY + (dir === "down" ? 1 : 1);

      for (let sy = syMin; sy <= syMax; sy++) {
        for (let sx = sxMin; sx <= sxMax; sx++) {
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            const dirBonus = dir === minorityDir ? 2000 * imbalance : 0;
            results.push({
              x: sx,
              y: sy,
              dir,
              score: scorePlacement(grid, word, sx, sy, dir, ix) + dirBonus,
            });
          }
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─── Recursive Backtracking Solver ──────────────────────

const BEAM_WIDTH = 16;

function solve(
  grid: Grid,
  refs: RefCount,
  remaining: LayoutWord[],
  idx: number,
  placed: Placed[],
  deadline: number,
): boolean {
  if (idx >= remaining.length) return true;
  if (Date.now() > deadline) return false;

  const entry = remaining[idx];
  const candidates = findPlacements(grid, entry.word, placed).slice(
    0,
    BEAM_WIDTH,
  );

  for (const c of candidates) {
    placeWord(grid, refs, entry.word, c.x, c.y, c.dir);
    placed.push({
      word: entry.word,
      x: c.x,
      y: c.y,
      dir: c.dir,
      clue: entry.clue,
      main_word_index: entry.main_word_index,
    });

    if (solve(grid, refs, remaining, idx + 1, placed, deadline)) return true;

    placed.pop();
    removeWord(grid, refs, entry.word, c.x, c.y, c.dir);
  }

  return false;
}

// ─── Greedy Fallback (intersection-only) ────────────────

function greedyPlace(
  grid: Grid,
  refs: RefCount,
  words: LayoutWord[],
  placed: Placed[],
) {
  let unplaced = [...words];
  let passes = 50;

  while (unplaced.length > 0 && passes-- > 0) {
    const still: LayoutWord[] = [];
    for (const wo of unplaced) {
      const candidates = findPlacements(grid, wo.word, placed);
      if (candidates.length > 0) {
        const best = candidates[0];
        placeWord(grid, refs, wo.word, best.x, best.y, best.dir);
        placed.push({
          word: wo.word,
          x: best.x,
          y: best.y,
          dir: best.dir,
          clue: wo.clue,
          main_word_index: wo.main_word_index,
        });
      } else {
        still.push(wo);
      }
    }
    if (still.length === unplaced.length) break;
    unplaced = still;
  }
}

// ─── Public Layout Functions ────────────────────────────

function generateLayout(words: LayoutWord[], seedHint: number) {
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
    const sorted = [...upper].sort((a, b) => b.word.length - a.word.length);
    shuffled = [];
    let i = 0;
    while (i < sorted.length) {
      let j = i;
      while (
        j < sorted.length &&
        sorted[j].word.length === sorted[i].word.length
      )
        j++;
      const group = sorted.slice(i, j);
      shuffled.push(...seededShuffle(group, random));
      i = j;
    }
  }

  const grid: Grid = {};
  const refs: RefCount = {};
  const placed: Placed[] = [];

  // Place first word
  const first = shuffled[0];
  const startDir = seed % 2 === 0 ? "across" : "down";
  placeWord(grid, refs, first.word, 0, 0, startDir);
  placed.push({
    word: first.word,
    x: 0,
    y: 0,
    dir: startDir,
    clue: first.clue,
    main_word_index: first.main_word_index,
  });

  // Phase 1: Backtracking
  const remaining = shuffled.slice(1);
  const deadline = Date.now() + 500;
  const btOk = solve(grid, refs, remaining, 0, placed, deadline);

  // Phase 2: Greedy fallback (intersection-only)
  if (!btOk) {
    const placedSet = new Set(placed.map((p) => p.word));
    const leftover = remaining.filter((w) => !placedSet.has(w.word));
    if (leftover.length > 0) greedyPlace(grid, refs, leftover, placed);
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

function generateLayoutOptimized(words: LayoutWord[], attempts = 200) {
  let bestLayout: ReturnType<typeof generateLayout> | null = null;
  let bestScore = -Infinity;
  const overallDeadline = Date.now() + 10000;

  for (let i = 0; i < attempts; i++) {
    if (Date.now() > overallDeadline) break;

    const layout = generateLayout(words, i + 1);

    const balancePenalty = layout.dirBalance > 4 ? -50000 : 0;
    const score =
      layout.wordsPlaced * 100000 +
      layout.density * 10000 -
      layout.area * 5 -
      layout.dirBalance * 500 +
      balancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }

    if (layout.success && layout.density > 0.45 && layout.dirBalance <= 4)
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
