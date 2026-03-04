/**
 * Crossword Layout Engine v12 — Proper Crossword Generation
 *
 * Generates layouts that follow real crossword rules:
 * 1. Every word must intersect (cross) at least one other word
 * 2. Intersections must be perpendicular with matching letters
 * 3. No parallel adjacency — words running in the same direction
 *    must not touch side-by-side (one-cell gap required)
 * 4. No word extensions — cells before/after a word must be empty
 * 5. Balanced across/down distribution
 */

// ─── Seeded RNG ───────────────────────────────────────────────────────

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

// ─── Grid (hash-map keyed by "x,y") ──────────────────────────────────

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

function placeWord(grid, refs, word, x, y, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    grid[key] = word[i];
    refs[key] = (refs[key] || 0) + 1;
  }
}

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

// ─── Placement Validation (strict crossword rules) ───────────────────

/**
 * Validate whether a word can be placed at (sx, sy) in direction `dir`.
 *
 * Returns the number of intersections (≥1 required for non-first words)
 * or -1 if the placement is invalid.
 *
 * Rules enforced:
 * 1. Bookend rule — cells immediately before the start and after the end
 *    of the word must be empty (prevents word extension).
 * 2. Intersection rule — any cell that already contains a letter must
 *    contain the SAME letter as the word at that position, and the
 *    existing letter must belong to a perpendicular word (not a parallel
 *    overlap).
 * 3. Parallel adjacency rule — for each NEW cell (not an intersection),
 *    the cells to the sides (perpendicular to placement direction) must
 *    be empty. This prevents two parallel words from running side by side.
 */
function checkPlacement(grid, word, sx, sy, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  // Perpendicular offsets for side-adjacency checks
  const pdx = dir === "across" ? 0 : 1;
  const pdy = dir === "across" ? 1 : 0;

  // Rule 1: Bookend — cells before start and after end must be empty
  const beforeKey = `${sx - dx},${sy - dy}`;
  const afterKey = `${sx + word.length * dx},${sy + word.length * dy}`;
  if (grid[beforeKey]) return -1;
  if (grid[afterKey]) return -1;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const x = sx + i * dx;
    const y = sy + i * dy;
    const key = `${x},${y}`;
    const existing = grid[key];

    if (existing) {
      // Rule 2: Letter must match at intersection
      if (existing !== word[i]) return -1;

      // Ensure this is a perpendicular crossing, not a parallel overlap.
      // Check if the existing cell has neighbors along our placement direction
      // (which would mean it's part of a word running in the SAME direction).
      const prevAlongKey = `${x - dx},${y - dy}`;
      const nextAlongKey = `${x + dx},${y + dy}`;
      if (i > 0 && grid[prevAlongKey] === word[i - 1]) return -1;
      if (i < word.length - 1 && grid[nextAlongKey] === word[i + 1]) return -1;

      intersections++;
    } else {
      // Rule 3: For new (non-intersection) cells, check side adjacency.
      // The perpendicular neighbors must be empty to prevent parallel stacking.
      const sideA = `${x + pdx},${y + pdy}`;
      const sideB = `${x - pdx},${y - pdy}`;
      if (grid[sideA]) return -1;
      if (grid[sideB]) return -1;
    }
  }

  return intersections;
}

// ─── Placement Scoring ────────────────────────────────────────────────

/**
 * Score a valid placement. Higher = better.
 *
 * Components:
 * - Intersections (strongly favored — the main driver of connectedness)
 * - Grid expansion penalty (prefer compact grids)
 * - Centre-of-mass proximity (keep words near the grid's center)
 */
function scorePlacement(grid, word, x, y, dir, intersections) {
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

// ─── Find Valid Placements ────────────────────────────────────────────

/**
 * Find all valid placements for a word, sorted best-first.
 *
 * Strategy: iterate over all already-placed words to find potential
 * intersection points (shared letters). For each shared letter, compute
 * the start position and validate. Also scans the full grid bounds to
 * catch multi-intersection positions missed by the letter-matching pass.
 */
function findPlacements(grid, word, placed, minorityDir, dirImbalance) {
  const seen = new Set();
  const results = [];

  // Phase 1: intersection-based (letter matching against placed words)
  for (const p of placed) {
    const pw = p.word;
    const pd = p.direction;
    for (let pi = 0; pi < pw.length; pi++) {
      for (let wj = 0; wj < word.length; wj++) {
        if (pw[pi] !== word[wj]) continue;

        // The intersection cell position
        const tx = pd === "across" ? p.x + pi : p.x;
        const ty = pd === "across" ? p.y : p.y + pi;

        for (const dir of ["across", "down"]) {
          // Skip same-direction as this placed word (would be parallel overlap)
          if (dir === pd) continue;

          const sx = dir === "across" ? tx - wj : tx;
          const sy = dir === "down" ? ty - wj : ty;
          const key = `${sx},${sy},${dir}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const ix = checkPlacement(grid, word, sx, sy, dir);
          if (ix > 0) {
            const dirBonus = dir === minorityDir ? 2000 * dirImbalance : 0;
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
  // that weren't found via phase 1 (e.g., words crossing 2+ existing words)
  if (Object.keys(grid).length > 0) {
    const bounds = getGridBounds(grid);
    for (const dir of ["across", "down"]) {
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
            const dirBonus = dir === minorityDir ? 2000 * dirImbalance : 0;
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

// ─── Direction Balance Helper ─────────────────────────────────────────

function getDirectionStats(placed) {
  let acrossN = 0;
  let downN = 0;
  for (const p of placed) {
    if (p.direction === "across") acrossN++;
    else downN++;
  }
  return {
    acrossN,
    downN,
    minorityDir: acrossN <= downN ? "across" : "down",
    imbalance: Math.abs(acrossN - downN),
  };
}

// ─── Recursive Backtracking Solver ────────────────────────────────────

const BEAM_WIDTH = 16;

function solve(grid, refs, words, idx, placed, deadline) {
  if (idx >= words.length) return true;
  if (Date.now() > deadline) return false;

  const word = words[idx].word;
  const { minorityDir, imbalance } = getDirectionStats(placed);
  const candidates = findPlacements(
    grid,
    word,
    placed,
    minorityDir,
    imbalance,
  ).slice(0, BEAM_WIDTH);

  for (const c of candidates) {
    placeWord(grid, refs, word, c.x, c.y, c.dir);
    placed.push({ ...words[idx], x: c.x, y: c.y, direction: c.dir });

    if (solve(grid, refs, words, idx + 1, placed, deadline)) return true;

    placed.pop();
    removeWord(grid, refs, word, c.x, c.y, c.dir);
  }

  return false;
}

// ─── Greedy Fallback (multi-pass, intersection-only) ──────────────────

function greedyPlace(grid, refs, words, placed) {
  let unplaced = [...words];
  let passes = 50;

  while (unplaced.length > 0 && passes-- > 0) {
    const still = [];
    for (const wo of unplaced) {
      const { minorityDir, imbalance } = getDirectionStats(placed);
      const candidates = findPlacements(
        grid,
        wo.word,
        placed,
        minorityDir,
        imbalance,
      );

      // Only accept placements with at least 1 intersection (no floating words)
      if (candidates.length > 0) {
        const best = candidates[0];
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
  const deadline = Date.now() + 500;
  const btOk = solve(grid, refs, remaining, 0, placed, deadline);

  // Phase 2: greedy fallback for any words backtracking couldn't place
  if (!btOk) {
    const placedSet = new Set(placed.map((p) => p.word));
    const leftover = remaining.filter((w) => !placedSet.has(w.word));
    if (leftover.length > 0) greedyPlace(grid, refs, leftover, placed);
  }

  // Build 2D matrix
  const bounds = getGridBounds(grid);
  const { matrix, width, height } = gridToMatrix(grid, bounds);

  // Normalise placed-word coordinates to (0,0)-based
  for (const p of placed) {
    p.x -= bounds.minX;
    p.y -= bounds.minY;
  }

  const letterCount = Object.keys(grid).length;
  const area = width * height;

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

    // Score: words placed >> density >> compactness >> balance
    const score =
      layout.wordsPlaced * 100000 +
      layout.densityScore * 10000 -
      layout.area * 5 -
      layout.dirBalance * 500 +
      balancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }

    // Early exit: all words placed with high density and acceptable balance
    if (layout.success && layout.densityScore > 0.45 && layout.dirBalance <= 4)
      break;
  }

  console.log(
    `Best layout: seed ${bestLayout.seed}, ${bestLayout.wordsPlaced}/${words.length} words, density ${(bestLayout.densityScore * 100).toFixed(1)}%, balance ${bestLayout.dirBalance}`,
  );

  return bestLayout;
}
