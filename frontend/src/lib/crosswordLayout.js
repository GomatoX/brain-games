/**
 * Crossword Layout Algorithm v8 - Maximum Density
 *
 * Aggressive density algorithm that:
 * - Tries ALL possible placements for each word
 * - Scores based on intersection count and compactness
 * - Heavily penalizes placements that expand grid bounds
 * - No isolated fallback placement - only connected words
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
 * Calculate how much a placement would expand the grid
 */
function calculateExpansion(grid, word, startX, startY, dir) {
  const bounds = getGridBounds(grid);
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

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

  return newArea - oldArea;
}

/**
 * Score a placement - higher is better
 */
function scorePlacement(grid, word, startX, startY, dir) {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

  let intersections = 0;

  for (let i = 0; i < word.length; i++) {
    const x = startX + i * dx;
    const y = startY + i * dy;
    const key = `${x},${y}`;

    if (grid[key]) {
      intersections++;
    }
  }

  // Calculate grid expansion penalty
  const expansion = calculateExpansion(grid, word, startX, startY, dir);

  // Score formula:
  // - +1000 per intersection (strongly favor overlaps)
  // - -50 per unit of grid expansion (aggressively penalize spreading out)
  // - +100 base for valid placement
  return intersections * 1000 - expansion * 50 + 100;
}

/**
 * Check if word can be validly placed
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
    } else {
      // Cell empty - check perpendicular neighbors
      // Only reject if it would create invalid adjacent letters
      const perpDx = dir === "across" ? 0 : 1;
      const perpDy = dir === "down" ? 0 : 1;

      // Check both perpendicular directions
      const n1Key = `${x + perpDx},${y + perpDy}`;
      const n2Key = `${x - perpDx},${y - perpDy}`;
      const n1 = grid[n1Key];
      const n2 = grid[n2Key];

      // If there's a neighbor, check if it's part of a perpendicular word
      // We need to ensure we're not creating invalid touching
      if (n1 || n2) {
        // Check if this creates an unwanted adjacency
        // Look for a continuous run of letters in perpendicular direction
        let hasRun = false;

        if (n1) {
          // Check if n1 has additional letters in that direction
          const nextKey = `${x + perpDx * 2},${y + perpDy * 2}`;
          if (grid[nextKey]) hasRun = true;
        }
        if (n2) {
          const nextKey = `${x - perpDx * 2},${y - perpDy * 2}`;
          if (grid[nextKey]) hasRun = true;
        }

        if (hasRun) return false;

        // Also check if both neighbors exist (sandwiched)
        if (n1 && n2) return false;
      }
    }
  }

  // Must intersect at least once (for connected crosswords)
  return intersections > 0;
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

  const setCell = (x, y, letter) => {
    grid[`${x},${y}`] = letter;
  };

  // Place first word horizontally at origin
  const first = shuffled[0];
  for (let i = 0; i < first.word.length; i++) {
    setCell(i, 0, first.word[i]);
  }
  placed.push({
    word: first.word,
    clue: first.clue,
    x: 0,
    y: 0,
    direction: "across",
  });

  // Try to place remaining words with multiple passes
  let unplaced = shuffled.slice(1);
  let maxPasses = 10; // More passes for better results
  let pass = 0;

  while (unplaced.length > 0 && pass < maxPasses) {
    pass++;
    const stillUnplaced = [];

    for (const wordObj of unplaced) {
      const word = wordObj.word;
      let bestPlacement = null;
      let bestScore = -Infinity;

      // Try EVERY letter of EVERY placed word as potential intersection
      for (const p of placed) {
        const pWord = p.word;

        for (let pi = 0; pi < pWord.length; pi++) {
          for (let wj = 0; wj < word.length; wj++) {
            if (pWord[pi] !== word[wj]) continue;

            // Try perpendicular direction
            const newDir = p.direction === "across" ? "down" : "across";
            let startX, startY;

            if (p.direction === "across") {
              startX = p.x + pi;
              startY = p.y - wj;
            } else {
              startX = p.x - wj;
              startY = p.y + pi;
            }

            if (isValid(grid, word, startX, startY, newDir)) {
              const score = scorePlacement(grid, word, startX, startY, newDir);
              if (score > bestScore) {
                bestScore = score;
                bestPlacement = { x: startX, y: startY, dir: newDir };
              }
            }
          }
        }
      }

      if (bestPlacement) {
        const dx = bestPlacement.dir === "across" ? 1 : 0;
        const dy = bestPlacement.dir === "down" ? 1 : 0;
        for (let k = 0; k < word.length; k++) {
          setCell(bestPlacement.x + k * dx, bestPlacement.y + k * dy, word[k]);
        }
        placed.push({
          word: word,
          clue: wordObj.clue,
          x: bestPlacement.x,
          y: bestPlacement.y,
          direction: bestPlacement.dir,
        });
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

    // Score: prioritize placing all words, then density
    const score =
      layout.wordsPlaced * 10000 + layout.densityScore * 100 - layout.area;

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
