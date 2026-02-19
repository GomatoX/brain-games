/**
 * Crossword Layout Algorithm v11 — Recursive Backtracking + Density Scoring
 *
 * 1. Data structure  — 2D matrix output
 * 2. Pre-processing  — words sorted by length descending (stable), shuffled within groups
 * 3. Dense logic     — recursive backtracking; placements scored by Density Score
 * 4. Density Score   — how many characters of the new word touch existing ones
 * 5. Heuristic       — rejects placements that create unfillable 1×1 holes
 * 6. Validation      — no side-by-side adjacency unless intersecting
 * 7. Fallback        — open-position scanning for words with unique characters
 */

// ─── Utility ──────────────────────────────────────────────────────────

function createRandom(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, random) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Grid helpers (hash-map internally, 2D matrix on output) ──────────

function getGridBounds(grid) {
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

/** Place a word, incrementing per-cell reference counts. */
function placeWord(grid, refs, word, x, y, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    grid[key] = word[i];
    refs[key] = (refs[key] || 0) + 1;
  }
}

/** Remove a word; only delete cells whose ref count drops to 0. */
function removeWord(grid, refs, word, x, y, dir) {
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

/** Convert hash-map grid → 2D matrix (null = empty). */
function gridToMatrix(grid, bounds) {
  const w = bounds.maxX - bounds.minX + 1;
  const h = bounds.maxY - bounds.minY + 1;
  const m = Array.from({ length: h }, () => Array(w).fill(null));
  for (const [key, letter] of Object.entries(grid)) {
    const [x, y] = key.split(",").map(Number);
    m[y - bounds.minY][x - bounds.minX] = letter;
  }
  return { matrix: m, width: w, height: h };
}

// ─── Validation ───────────────────────────────────────────────────────

/**
 * Check basic placement validity.
 * Returns intersection count (≥0) or -1 if invalid.
 *
 * Rules enforced:
 * - Letters at intersections must match
 * - No word extension (cell before start / after end must be empty)
 */
function checkPlacement(grid, word, sx, sy, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  // word-extension guard
  if (grid[`${sx - dx},${sy - dy}`]) return -1;
  if (grid[`${sx + word.length * dx},${sy + word.length * dy}`]) return -1;

  let intersections = 0;
  for (let i = 0; i < word.length; i++) {
    const x = sx + i * dx;
    const y = sy + i * dy;
    const existing = grid[`${x},${y}`];

    if (existing) {
      if (existing !== word[i]) return -1;

      // Reject parallel overlap: if the neighbor ALONG the placement direction
      // is also filled, this is a same-direction overlap, not a crossing.
      const prevKey = `${x - dx},${y - dy}`;
      const nextKey = `${x + dx},${y + dy}`;
      if (i > 0 && grid[prevKey] === word[i - 1]) return -1;
      if (i < word.length - 1 && grid[nextKey] === word[i + 1]) return -1;

      intersections++;
    }
  }
  return intersections;
}

// ─── Density Score ────────────────────────────────────────────────────

/**
 * Placement score combining:
 *  - Touching characters  (how many cells of the word contact existing letters)
 *  - Grid expansion penalty (penalise layouts that grow the bounding box)
 *  - Compactness bonus     (prefer placement near the grid's centre of mass)
 */
function densityScore(grid, word, x, y, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  // 1. Touching characters
  let touching = 0;
  for (let i = 0; i < word.length; i++) {
    const cx = x + i * dx;
    const cy = y + i * dy;
    if (grid[`${cx},${cy}`]) {
      touching += 3; // intersection — strongest touch
    } else {
      if (grid[`${cx + 1},${cy}`]) touching++;
      if (grid[`${cx - 1},${cy}`]) touching++;
      if (grid[`${cx},${cy + 1}`]) touching++;
      if (grid[`${cx},${cy - 1}`]) touching++;
    }
  }

  // 2. Grid expansion penalty
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

  // 3. Compactness: distance from centre of mass
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

  // Combined score (higher = better)
  return touching * 2000 - expansion * 150 - distFromCom * 10 + 50;
}

// ─── 1×1 Hole Detection ──────────────────────────────────────────────

/**
 * Would placing this word create an unfillable 1×1 hole?
 * (An empty cell walled-in on all four orthogonal sides.)
 */
function wouldCreateHoles(grid, word, x, y, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  // temporarily place new cells
  const tmp = [];
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    if (!grid[key]) {
      grid[key] = word[i];
      tmp.push(key);
    }
  }

  let found = false;
  const checked = new Set();
  for (const key of tmp) {
    if (found) break;
    const [cx, cy] = key.split(",").map(Number);
    for (const [nx, ny] of [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ]) {
      const nk = `${nx},${ny}`;
      if (checked.has(nk) || grid[nk]) continue;
      checked.add(nk);
      if (
        grid[`${nx + 1},${ny}`] &&
        grid[`${nx - 1},${ny}`] &&
        grid[`${nx},${ny + 1}`] &&
        grid[`${nx},${ny - 1}`]
      ) {
        found = true;
        break;
      }
    }
  }

  // undo temporary cells
  for (const key of tmp) delete grid[key];
  return found;
}

/**
 * Find valid placements for a word, sorted best-first.
 *
 * Phase 1a: intersection-based — crosses existing words at shared letters.
 * Phase 1b: brute-force grid scan — finds multi-intersection positions.
 * Phase 2:  fallback — scans adjacent to grid with margin 1.
 */
function findPlacements(grid, word, placed) {
  const seen = new Set();
  const results = [];

  // Determine minority direction for bonus
  let acrossN = 0;
  let downN = 0;
  for (const p of placed) {
    if (p.direction === "across") acrossN++;
    else downN++;
  }
  const minorityDir = acrossN <= downN ? "across" : "down";
  const dirDiff = Math.abs(acrossN - downN);

  // Phase 1a: intersection-based placement (letter matching)
  for (const p of placed) {
    const pw = p.word;
    const pd = p.direction;
    for (let pi = 0; pi < pw.length; pi++) {
      for (let wj = 0; wj < word.length; wj++) {
        if (pw[pi] !== word[wj]) continue;
        const tx = pd === "across" ? p.x + pi : p.x;
        const ty = pd === "across" ? p.y : p.y + pi;

        for (const dir of ["across", "down"]) {
          const sx = dir === "across" ? tx - wj : tx;
          const sy = dir === "down" ? ty - wj : ty;
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            const dirBonus = dir === minorityDir ? 3000 * dirDiff : 0;
            results.push({
              x: sx,
              y: sy,
              dir,
              score:
                densityScore(grid, word, sx, sy, dir) + ix * 8000 + dirBonus,
            });
          }
        }
      }
    }
  }

  // Phase 1b: brute-force grid scan for extra intersection positions
  if (Object.keys(grid).length > 0) {
    const bounds = getGridBounds(grid);
    for (const dir of ["across", "down"]) {
      const sxMin = bounds.minX - (dir === "across" ? word.length : 0);
      const sxMax = bounds.maxX + (dir === "across" ? 1 : 0);
      const syMin = bounds.minY - (dir === "down" ? word.length : 0);
      const syMax = bounds.maxY + (dir === "down" ? 1 : 0);

      for (let sy = syMin; sy <= syMax; sy++) {
        for (let sx = sxMin; sx <= sxMax; sx++) {
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            const dirBonus = dir === minorityDir ? 3000 * dirDiff : 0;
            results.push({
              x: sx,
              y: sy,
              dir,
              score:
                densityScore(grid, word, sx, sy, dir) + ix * 8000 + dirBonus,
            });
          }
        }
      }
    }
  }

  // Phase 2: no-intersection fallback (adjacent to grid boundary)
  if (results.length === 0) {
    const bounds = getGridBounds(grid);
    for (const dir of ["across", "down"]) {
      const margin = 1;
      const startX = bounds.minX - word.length - margin;
      const endX = bounds.maxX + margin;
      const startY = bounds.minY - word.length - margin;
      const endY = bounds.maxY + margin;

      for (let sy = startY; sy <= endY; sy++) {
        for (let sx = startX; sx <= endX; sx++) {
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix >= 0) {
            const dirBonus = dir === minorityDir ? 3000 * dirDiff : 0;
            results.push({
              x: sx,
              y: sy,
              dir,
              score: densityScore(grid, word, sx, sy, dir) + dirBonus,
            });
          }
        }
      }
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─── Recursive Backtracking Solver ────────────────────────────────────

const BEAM_WIDTH = 12;

function solve(grid, refs, words, idx, placed, deadline) {
  if (idx >= words.length) return true;
  if (Date.now() > deadline) return false;

  const word = words[idx].word;
  const candidates = findPlacements(grid, word, placed).slice(0, BEAM_WIDTH);

  for (const c of candidates) {
    if (wouldCreateHoles(grid, word, c.x, c.y, c.dir)) continue;

    placeWord(grid, refs, word, c.x, c.y, c.dir);
    placed.push({ ...words[idx], x: c.x, y: c.y, direction: c.dir });

    if (solve(grid, refs, words, idx + 1, placed, deadline)) return true;

    placed.pop();
    removeWord(grid, refs, word, c.x, c.y, c.dir);
  }

  return false;
}

// ─── Greedy fallback (multi-pass, used when backtracking times out) ───

function greedyPlace(grid, refs, words, placed) {
  let unplaced = [...words];
  let passes = 30;

  while (unplaced.length > 0 && passes-- > 0) {
    const still = [];
    for (const wo of unplaced) {
      const candidates = findPlacements(grid, wo.word, placed);
      const valid = candidates.filter(
        (c) => !wouldCreateHoles(grid, wo.word, c.x, c.y, c.dir),
      );
      if (valid.length > 0) {
        const best = valid[0];
        placeWord(grid, refs, wo.word, best.x, best.y, best.dir);
        placed.push({ ...wo, x: best.x, y: best.y, direction: best.dir });
      } else {
        still.push(wo);
      }
    }
    if (still.length === unplaced.length) break;
    unplaced = still;
  }

  if (unplaced.length > 0) {
    console.warn(
      `Could not place ${unplaced.length} words:`,
      unplaced.map((w) => w.word),
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────────

export function generateLayout(words, seed = 1) {
  if (!words || words.length === 0) {
    return {
      placedWords: [],
      grid: [],
      gridSize: 10,
      success: false,
      seed,
      densityScore: 0,
      wordsPlaced: 0,
      area: 0,
    };
  }

  const random = createRandom(seed);

  // Pre-processing: alternate between length-sorted and fully-random ordering
  const upper = [...words].map((w) => ({ ...w, word: w.word.toUpperCase() }));

  let shuffled;
  if (seed % 2 === 0) {
    // Fully random order — explores different layout topologies
    shuffled = seededShuffle([...upper], random);
  } else {
    // Length-sorted (longest first) with same-length shuffling
    upper.sort((a, b) => b.word.length - a.word.length);
    shuffled = [];
    let i = 0;
    while (i < upper.length) {
      let j = i;
      while (j < upper.length && upper[j].word.length === upper[i].word.length)
        j++;
      const group = upper.slice(i, j);
      shuffled.push(...seededShuffle(group, random));
      i = j;
    }
  }

  const grid = {};
  const refs = {};
  const placed = [];

  // Place first word at origin — alternate starting direction by seed
  const first = shuffled[0];
  const startDir = seed % 2 === 0 ? "across" : "down";
  placeWord(grid, refs, first.word, 0, 0, startDir);
  placed.push({ ...first, x: 0, y: 0, direction: startDir });

  // Phase 1: recursive backtracking (time-budgeted)
  const remaining = shuffled.slice(1);
  const deadline = Date.now() + 300;
  const btOk = solve(grid, refs, remaining, 0, placed, deadline);

  // Phase 2: greedy fallback for any words backtracking couldn't place
  if (!btOk) {
    const placedSet = new Set(placed.map((p) => p.word));
    const leftover = remaining.filter((w) => !placedSet.has(w.word));
    if (leftover.length > 0) greedyPlace(grid, refs, leftover, placed);
  }

  // Build 2D matrix before normalising coordinates
  const bounds = getGridBounds(grid);
  const { matrix, width, height } = gridToMatrix(grid, bounds);

  // Normalise placed-word coordinates to (0,0)-based
  for (const p of placed) {
    p.x -= bounds.minX;
    p.y -= bounds.minY;
  }

  const letterCount = Object.keys(grid).length;
  const area = width * height;

  // Compute direction balance (0 = perfect, higher = more imbalanced)
  let acrossCount = 0;
  let downCount = 0;
  for (const p of placed) {
    if (p.direction === "across") acrossCount++;
    else downCount++;
  }
  const dirBalance = Math.abs(acrossCount - downCount);

  return {
    placedWords: placed,
    grid: matrix,
    gridSize: Math.max(width, height, 5),
    gridWidth: width,
    gridHeight: height,
    success: placed.length === words.length,
    seed,
    densityScore: letterCount / area,
    wordsPlaced: placed.length,
    area,
    dirBalance,
  };
}

/**
 * Try multiple seeds and return the best layout.
 */
export function generateLayoutOptimized(words, seedHint = 1, attempts = 200) {
  let bestLayout = null;
  let bestScore = -Infinity;
  const overallDeadline = Date.now() + 10000; // 10 s total cap

  for (let i = 0; i < attempts; i++) {
    if (Date.now() > overallDeadline) break;

    const layout = generateLayout(words, seedHint + i);

    // Hard penalty for extreme imbalance (worse than 6:2)
    const balancePenalty = layout.dirBalance > 4 ? -50000 : 0;

    // Score: words placed >> density >> compactness
    const score =
      layout.wordsPlaced * 100000 +
      layout.densityScore * 10000 -
      layout.area * 5 -
      layout.dirBalance * 100 +
      balancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }

    // early exit: all words placed with high density and acceptable balance
    if (layout.success && layout.densityScore > 0.55 && layout.dirBalance <= 4)
      break;
  }

  console.log(
    `Best layout: seed ${bestLayout.seed}, ${bestLayout.wordsPlaced}/${words.length} words, density ${(bestLayout.densityScore * 100).toFixed(1)}%, balance ${bestLayout.dirBalance}`,
  );

  return bestLayout;
}
