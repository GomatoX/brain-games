/**
 * Crossword Layout Algorithm v9 - Ultra Dense
 *
 * Major improvements over v8:
 * - Relaxed adjacency validation for newspaper-style density
 * - Tries BOTH directions for each placement (not just perpendicular)
 * - Scores reward adjacency and gap-filling
 * - Center-of-mass compactness scoring
 * - Multiple word ordering strategies per seed
 */

/**
 * Seeded random number generator (mulberry32)
 */
function createRandom(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffle array using seeded random
 */
function seededShuffle(array, random) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Get current grid bounds
 */
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
  if (minX === Infinity) {
    return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }
  return { minX, minY, maxX, maxY };
}

/**
 * Check if word can be validly placed.
 * Relaxed rules for dense newspaper-style crosswords:
 * - Letters at intersections must match
 * - No accidental word extension (empty before start and after end)
 * - At least one intersection with existing grid required
 * - Parallel adjacent words are allowed (key change from v8)
 */
function isValid(grid, word, startX, startY, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  // Check before start is empty (no accidental word extension)
  const bx = startX - dx;
  const by = startY - dy;
  if (grid[`${bx},${by}`]) return false;

  // Check after end is empty
  const ax = startX + word.length * dx;
  const ay = startY + word.length * dy;
  if (grid[`${ax},${ay}`]) return false;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    const key = `${x},${y}`;
    const letter = word[i];
    const existing = grid[key];

    if (existing) {
      // Cell occupied - must match
      if (existing !== letter) return false;
      intersections++;
    }
    // No perpendicular adjacency restriction — words can freely
    // touch each other, just like in newspaper crosswords.
    // The only rules are: letter matching at intersections,
    // and no accidental word extension (checked above).
  }

  // Must intersect at least once (for connected crosswords)
  return intersections > 0;
}

/**
 * Score a placement - higher is better
 * Dense scoring rewards:
 * - Intersections (sharing letters with existing words)
 * - Adjacency (touching existing letters without crossing)
 * - Compactness (staying close to grid center of mass)
 * - NOT expanding the grid boundaries
 */
function scorePlacement(grid, word, startX, startY, dir, bounds) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  let intersections = 0;
  let adjacencies = 0;
  let newCells = 0;

  // Calculate center of mass of current grid
  const keys = Object.keys(grid);
  let centerX = 0;
  let centerY = 0;
  for (const key of keys) {
    const [kx, ky] = key.split(",").map(Number);
    centerX += kx;
    centerY += ky;
  }
  centerX /= keys.length || 1;
  centerY /= keys.length || 1;

  let distFromCenter = 0;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    const key = `${x},${y}`;

    if (grid[key]) {
      intersections++;
    } else {
      newCells++;
      // Distance from center of mass
      distFromCenter += Math.abs(x - centerX) + Math.abs(y - centerY);

      // Count adjacent filled cells (bonus for filling gaps)
      const neighbors = [
        `${x + 1},${y}`,
        `${x - 1},${y}`,
        `${x},${y + 1}`,
        `${x},${y - 1}`,
      ];
      for (const nk of neighbors) {
        if (grid[nk]) adjacencies++;
      }
    }
  }

  // Calculate grid expansion
  let newMinX = bounds.minX;
  let newMinY = bounds.minY;
  let newMaxX = bounds.maxX;
  let newMaxY = bounds.maxY;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    newMinX = Math.min(newMinX, x);
    newMinY = Math.min(newMinY, y);
    newMaxX = Math.max(newMaxX, x);
    newMaxY = Math.max(newMaxY, y);
  }

  const oldArea =
    (bounds.maxX - bounds.minX + 1) * (bounds.maxY - bounds.minY + 1);
  const newArea = (newMaxX - newMinX + 1) * (newMaxY - newMinY + 1);
  const expansion = newArea - oldArea;

  // Score formula:
  // - +2000 per intersection (strongly favor letter sharing)
  // - +200 per adjacency (reward touching existing words)
  // - -100 per unit of grid expansion (heavily penalize spreading)
  // - -5 per unit of distance from center (prefer compact placement)
  // - +50 base for valid placement
  return (
    intersections * 2000 +
    adjacencies * 200 -
    expansion * 100 -
    distFromCenter * 5 +
    50
  );
}

/**
 * Generate a crossword layout from words
 */
export function generateLayout(words, seed = 1) {
  if (!words || words.length === 0) {
    return { placedWords: [], gridSize: 10, success: false, seed };
  }

  const random = createRandom(seed);

  // Sort by word length (longest first) then shuffle for variety
  const sorted = [...words]
    .map((w) => ({ ...w, word: w.word.toUpperCase() }))
    .sort((a, b) => b.word.length - a.word.length);

  const shuffled = seededShuffle(sorted, random);

  const grid = {}; // "x,y" -> letter
  const placed = [];
  const placedDirs = []; // Track direction per placed word for both-dir search

  const setCell = (x, y, letter) => {
    grid[`${x},${y}`] = letter;
  };

  // Place first word horizontally at origin
  const first = shuffled[0];
  for (let i = 0; i < first.word.length; i++) {
    setCell(i, 0, first.word[i]);
  }
  placed.push({
    ...first,
    x: 0,
    y: 0,
    direction: "across",
  });
  placedDirs.push("across");

  // Try to place remaining words with multiple passes
  let unplaced = shuffled.slice(1);
  let maxPasses = 15;
  let pass = 0;

  while (unplaced.length > 0 && pass < maxPasses) {
    pass++;
    const stillUnplaced = [];

    for (const wordObj of unplaced) {
      const word = wordObj.word;
      let bestPlacement = null;
      let bestScore = -Infinity;

      const bounds = getGridBounds(grid);

      // Strategy 1: Try intersecting with EVERY letter of EVERY placed word
      for (let pi2 = 0; pi2 < placed.length; pi2++) {
        const p = placed[pi2];
        const pWord = p.word;

        for (let pi = 0; pi < pWord.length; pi++) {
          for (let wj = 0; wj < word.length; wj++) {
            if (pWord[pi] !== word[wj]) continue;

            // Try BOTH directions (not just perpendicular)
            const dirs = ["across", "down"];
            for (const newDir of dirs) {
              let startX, startY;

              if (newDir === "across") {
                // Place horizontally: the wj-th letter of our word
                // must land on the pi-th letter of the placed word
                const targetX = p.direction === "across" ? p.x + pi : p.x;
                const targetY = p.direction === "across" ? p.y : p.y + pi;
                startX = targetX - wj;
                startY = targetY;
              } else {
                // Place vertically
                const targetX = p.direction === "across" ? p.x + pi : p.x;
                const targetY = p.direction === "across" ? p.y : p.y + pi;
                startX = targetX;
                startY = targetY - wj;
              }

              if (isValid(grid, word, startX, startY, newDir)) {
                const score = scorePlacement(
                  grid,
                  word,
                  startX,
                  startY,
                  newDir,
                  bounds,
                );
                if (score > bestScore) {
                  bestScore = score;
                  bestPlacement = { x: startX, y: startY, dir: newDir };
                }
              }
            }
          }
        }
      }

      // Strategy 2: Try placing adjacent to existing grid cells
      // Scan the perimeter of the current grid for valid positions
      if (!bestPlacement) {
        const bounds2 = getGridBounds(grid);
        for (const dir of ["across", "down"]) {
          const ddx = dir === "across" ? 1 : 0;
          const ddy = dir === "down" ? 1 : 0;

          // Try positions within and slightly outside the grid bounds
          for (let y = bounds2.minY - word.length; y <= bounds2.maxY + 1; y++) {
            for (
              let x = bounds2.minX - word.length;
              x <= bounds2.maxX + 1;
              x++
            ) {
              if (isValid(grid, word, x, y, dir)) {
                const score = scorePlacement(grid, word, x, y, dir, bounds2);
                if (score > bestScore) {
                  bestScore = score;
                  bestPlacement = { x, y, dir };
                }
              }
            }
          }
        }
      }

      if (bestPlacement) {
        const ddx = bestPlacement.dir === "across" ? 1 : 0;
        const ddy = bestPlacement.dir === "down" ? 1 : 0;
        for (let k = 0; k < word.length; k++) {
          setCell(
            bestPlacement.x + k * ddx,
            bestPlacement.y + k * ddy,
            word[k],
          );
        }
        placed.push({
          ...wordObj,
          x: bestPlacement.x,
          y: bestPlacement.y,
          direction: bestPlacement.dir,
        });
        placedDirs.push(bestPlacement.dir);
      } else {
        stillUnplaced.push(wordObj);
      }
    }

    // If no progress, break
    if (stillUnplaced.length === unplaced.length) {
      break;
    }
    unplaced = stillUnplaced;
  }

  // Log unplaced words (these couldn't be connected)
  if (unplaced.length > 0) {
    console.warn(
      `Could not place ${unplaced.length} words (no valid intersections):`,
      unplaced.map((w) => w.word),
    );
  }

  // Normalize coordinates to start at (0, 0)
  const bounds = getGridBounds(grid);
  for (const p of placed) {
    p.x -= bounds.minX;
    p.y -= bounds.minY;
  }

  const width = bounds.maxX - bounds.minX + 1;
  const height = bounds.maxY - bounds.minY + 1;
  const size = Math.max(width, height, 5);

  // Calculate density score for comparison
  const letterCount = Object.keys(grid).length;
  const area = width * height;
  const densityScore = letterCount / area; // Higher is better

  return {
    placedWords: placed,
    gridSize: size,
    success: placed.length === words.length,
    seed: seed,
    densityScore: densityScore,
    wordsPlaced: placed.length,
    area: area,
  };
}

/**
 * Try multiple seeds and return the layout with best density
 * @param {Array} words - Words to place
 * @param {number} seedHint - Starting seed (will try variations around it)
 * @param {number} attempts - Number of seeds to try (default: 20)
 */
export function generateLayoutOptimized(words, seedHint = 1, attempts = 20) {
  let bestLayout = null;
  let bestScore = -Infinity;

  for (let i = 0; i < attempts; i++) {
    const seed = seedHint + i;
    const layout = generateLayout(words, seed);

    // Score: prioritize placing all words, then density, then small area
    const score =
      layout.wordsPlaced * 10000 + layout.densityScore * 1000 - layout.area * 2;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }
  }

  console.log(
    `Best layout: seed ${bestLayout.seed}, ${bestLayout.wordsPlaced}/${words.length} words, density ${(bestLayout.densityScore * 100).toFixed(1)}%`,
  );

  return bestLayout;
}
