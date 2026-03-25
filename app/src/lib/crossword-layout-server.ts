/**
 * Server-side Crossword Layout Engine
 *
 * Port of the client-side crosswordLayout.js for server-side pre-computation.
 * Generates the layout when saving/publishing a crossword so answers never
 * need to be sent to the client.
 */

// ─── Types ────────────────────────────────────────────────

interface WordInput {
  word: string;
  clue: string;
  main_word_index?: number;
}

interface PlacedWord {
  word: string;
  clue: string;
  main_word_index?: number;
  x: number;
  y: number;
  direction: "across" | "down";
  _number?: number;
}

interface GridCell {
  letter: string;
  isBlocked: boolean;
  number: number | null;
}

interface LayoutResult {
  placedWords: PlacedWord[];
  grid: (string | null)[][];
  gridSize: number;
  gridWidth: number;
  gridHeight: number;
  success: boolean;
  seed: number;
  densityScore: number;
  wordsPlaced: number;
  area: number;
  dirBalance: number;
}

export interface PreComputedLayout {
  /** Grid cells for client rendering (no answer letters, just structure) */
  cells: {
    row: number;
    col: number;
    isBlocked: boolean;
    number: number | null;
  }[];
  /** Clue data (no answers) */
  clues: {
    number: number;
    clue: string;
    direction: "across" | "down";
    startRow: number;
    startCol: number;
    length: number;
  }[];
  /** Grid dimensions */
  gridWidth: number;
  gridHeight: number;
  gridSize: number;
  seed: number;
  /** Answer data for server-side validation (stored but never sent to client) */
  answers: {
    /** Map of "row,col" -> expected letter */
    cells: Record<string, string>;
    /** Word answer data for per-word validation */
    words: {
      number: number;
      direction: "across" | "down";
      word: string;
      cells: string[];
    }[];
  };
  /** Main word metadata */
  mainWord?: {
    word: string;
    cells: { row: number; col: number; letterIndex: number }[];
  };
}

// ─── Seeded RNG ───────────────────────────────────────────

const createRandom = (seed: number) => {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const seededShuffle = <T>(array: T[], random: () => number): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ─── Grid (hash-map keyed by "x,y") ──────────────────────

const getGridBounds = (grid: Record<string, string>) => {
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
};

const placeWord = (
  grid: Record<string, string>,
  refs: Record<string, number>,
  word: string,
  x: number,
  y: number,
  dir: string,
) => {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    const key = `${x + i * dx},${y + i * dy}`;
    grid[key] = word[i];
    refs[key] = (refs[key] || 0) + 1;
  }
};

const removeWord = (
  grid: Record<string, string>,
  refs: Record<string, number>,
  word: string,
  x: number,
  y: number,
  dir: string,
) => {
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
};

const gridToMatrix = (
  grid: Record<string, string>,
  bounds: ReturnType<typeof getGridBounds>,
) => {
  const w = bounds.maxX - bounds.minX + 1;
  const h = bounds.maxY - bounds.minY + 1;
  const m: (string | null)[][] = Array.from({ length: h }, () =>
    Array(w).fill(null),
  );
  for (const [key, letter] of Object.entries(grid)) {
    const [x, y] = key.split(",").map(Number);
    m[y - bounds.minY][x - bounds.minX] = letter;
  }
  return { matrix: m, width: w, height: h };
};

// ─── Placement Validation ─────────────────────────────────

const checkPlacement = (
  grid: Record<string, string>,
  word: string,
  sx: number,
  sy: number,
  dir: string,
) => {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;
  const pdx = dir === "across" ? 0 : 1;
  const pdy = dir === "across" ? 1 : 0;

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
      if (existing !== word[i]) return -1;
      const prevAlongKey = `${x - dx},${y - dy}`;
      const nextAlongKey = `${x + dx},${y + dy}`;
      if (i > 0 && grid[prevAlongKey] === word[i - 1]) return -1;
      if (i < word.length - 1 && grid[nextAlongKey] === word[i + 1]) return -1;
      intersections++;
    } else {
      const sideA = `${x + pdx},${y + pdy}`;
      const sideB = `${x - pdx},${y - pdy}`;
      if (grid[sideA]) return -1;
      if (grid[sideB]) return -1;
    }
  }

  return intersections;
};

// ─── Placement Scoring ────────────────────────────────────

const scorePlacement = (
  grid: Record<string, string>,
  word: string,
  x: number,
  y: number,
  dir: string,
  intersections: number,
) => {
  const dx = dir === "across" ? 1 : 0;
  const dy = dir === "down" ? 1 : 0;

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

  return intersections * 8000 - expansion * 600 - distFromCom * 60;
};

// ─── Find Valid Placements ────────────────────────────────

interface PlacedRef {
  word: string;
  x: number;
  y: number;
  direction: string;
}

const findPlacements = (
  grid: Record<string, string>,
  word: string,
  placed: PlacedRef[],
  minorityDir: string,
  dirImbalance: number,
) => {
  const seen = new Set<string>();
  const results: { x: number; y: number; dir: string; score: number }[] = [];

  for (const p of placed) {
    const pw = p.word;
    const pd = p.direction;
    for (let pi = 0; pi < pw.length; pi++) {
      for (let wj = 0; wj < word.length; wj++) {
        if (pw[pi] !== word[wj]) continue;

        const tx = pd === "across" ? p.x + pi : p.x;
        const ty = pd === "across" ? p.y : p.y + pi;

        for (const dir of ["across", "down"]) {
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
};

// ─── Direction Balance ────────────────────────────────────

const getDirectionStats = (placed: PlacedRef[]) => {
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
};

// ─── Recursive Backtracking Solver ────────────────────────

const BEAM_WIDTH = 20;

interface WordEntry {
  word: string;
  clue: string;
  main_word_index?: number;
}

const solve = (
  grid: Record<string, string>,
  refs: Record<string, number>,
  words: WordEntry[],
  idx: number,
  placed: PlacedRef[],
  deadline: number,
): boolean => {
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
};

// ─── Greedy Fallback ──────────────────────────────────────

const greedyPlace = (
  grid: Record<string, string>,
  refs: Record<string, number>,
  words: WordEntry[],
  placed: PlacedRef[],
) => {
  let unplaced = [...words];
  let passes = 80;

  while (unplaced.length > 0 && passes-- > 0) {
    const still: WordEntry[] = [];
    for (const wo of unplaced) {
      const { minorityDir, imbalance } = getDirectionStats(placed);
      const candidates = findPlacements(
        grid,
        wo.word,
        placed,
        minorityDir,
        imbalance,
      );

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
};

// ─── Layout Generation ────────────────────────────────────

const generateLayout = (words: WordEntry[], seed = 1): LayoutResult => {
  if (!words || words.length === 0) {
    return {
      placedWords: [],
      grid: [],
      gridSize: 10,
      gridWidth: 0,
      gridHeight: 0,
      success: false,
      seed,
      densityScore: 0,
      wordsPlaced: 0,
      area: 0,
      dirBalance: 0,
    };
  }

  const random = createRandom(seed);
  const upper = [...words].map((w) => ({ ...w, word: w.word.toUpperCase() }));

  let shuffled: WordEntry[];
  if (seed % 2 === 0) {
    shuffled = seededShuffle([...upper], random);
  } else {
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

  const grid: Record<string, string> = {};
  const refs: Record<string, number> = {};
  const placed: PlacedRef[] = [];

  const first = shuffled[0];
  const startDir = seed % 2 === 0 ? "across" : "down";
  placeWord(grid, refs, first.word, 0, 0, startDir);
  placed.push({ ...first, x: 0, y: 0, direction: startDir });

  const remaining = shuffled.slice(1);
  const deadline = Date.now() + 400;
  const btOk = solve(grid, refs, remaining, 0, placed, deadline);

  if (!btOk) {
    const placedSet = new Set(placed.map((p) => p.word));
    const leftover = remaining.filter((w) => !placedSet.has(w.word));
    if (leftover.length > 0) greedyPlace(grid, refs, leftover, placed);
  }

  const bounds = getGridBounds(grid);
  const { matrix, width, height } = gridToMatrix(grid, bounds);

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

  return {
    placedWords: placed as PlacedWord[],
    grid: matrix,
    gridSize: Math.max(width, height, 5),
    gridWidth: width,
    gridHeight: height,
    success: placed.length === words.length,
    seed,
    densityScore: letterCount / area,
    wordsPlaced: placed.length,
    area,
    dirBalance: Math.abs(acrossCount - downCount),
  };
};

// ─── Optimized Multi-Seed ─────────────────────────────────

const generateLayoutOptimized = (
  words: WordEntry[],
  seedHint = 1,
  attempts = 200,
): LayoutResult => {
  let bestLayout: LayoutResult | null = null;
  let bestScore = -Infinity;
  const overallDeadline = Date.now() + 1000;

  for (let i = 0; i < attempts; i++) {
    if (Date.now() > overallDeadline) break;

    const layout = generateLayout(words, seedHint + i);

    const balancePenalty = layout.dirBalance > 4 ? -50000 : 0;

    const score =
      layout.wordsPlaced * 100000 +
      layout.densityScore * 20000 -
      layout.area * 50 -
      layout.dirBalance * 500 +
      balancePenalty;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = layout;
    }

    if (layout.success && layout.densityScore > 0.65 && layout.dirBalance <= 4)
      break;
  }

  return bestLayout!;
};

// ─── Public API: Compute Layout for Storage ───────────────

export const computeCrosswordLayout = (
  words: WordInput[],
  mainWord?: string | null,
  seedHint = 1,
): PreComputedLayout => {
  const layout = generateLayoutOptimized(words, seedHint, 1000);

  // Sort placed words by position (y*cols + x) and assign numbers
  const sortedWords = [...layout.placedWords].sort((a, b) => {
    const posA = a.y * layout.gridWidth + a.x;
    const posB = b.y * layout.gridWidth + b.x;
    return posA - posB;
  });

  let wordNumber = 1;
  const numberedCells = new Map<string, number>();

  for (const word of sortedWords) {
    const cellKey = `${word.x},${word.y}`;
    if (!numberedCells.has(cellKey)) {
      numberedCells.set(cellKey, wordNumber++);
    }
    word._number = numberedCells.get(cellKey)!;
  }

  // Trim dead space
  let maxUsedRow = 0;
  let maxUsedCol = 0;
  const gridRows = layout.gridHeight;
  const gridCols = layout.gridWidth;

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      if (layout.grid[row]?.[col] !== null) {
        maxUsedRow = Math.max(maxUsedRow, row);
        maxUsedCol = Math.max(maxUsedCol, col);
      }
    }
  }

  const trimmedRows = maxUsedRow + 1;
  const trimmedCols = maxUsedCol + 1;

  // Build cells (public — no letters)
  const cells: PreComputedLayout["cells"] = [];
  for (let row = 0; row < trimmedRows; row++) {
    for (let col = 0; col < trimmedCols; col++) {
      const hasLetter = layout.grid[row]?.[col] !== null;
      const numKey = `${col},${row}`;
      cells.push({
        row,
        col,
        isBlocked: !hasLetter,
        number: numberedCells.get(numKey) ?? null,
      });
    }
  }

  // Build clues (public — no answers)
  const clues: PreComputedLayout["clues"] = sortedWords.map((w) => ({
    number: w._number!,
    clue: w.clue,
    direction: w.direction as "across" | "down",
    startRow: w.y,
    startCol: w.x,
    length: w.word.length,
  }));

  // Build answers (private — stored but never sent to client)
  const answerCells: Record<string, string> = {};
  const answerWords: PreComputedLayout["answers"]["words"] = [];

  for (const w of sortedWords) {
    const dx = w.direction === "across" ? 1 : 0;
    const dy = w.direction === "down" ? 1 : 0;
    const wordCells: string[] = [];

    for (let i = 0; i < w.word.length; i++) {
      const cellKey = `${w.y + i * dy},${w.x + i * dx}`;
      answerCells[cellKey] = w.word[i].toUpperCase();
      wordCells.push(cellKey);
    }

    answerWords.push({
      number: w._number!,
      direction: w.direction as "across" | "down",
      word: w.word.toUpperCase(),
      cells: wordCells,
    });
  }

  // Build main word metadata
  let mainWordData: PreComputedLayout["mainWord"];
  if (mainWord) {
    const mainWordUpper = mainWord.toUpperCase();
    const mainWordCells: { row: number; col: number; letterIndex: number }[] =
      [];
    const used = new Set<number>();

    for (const w of sortedWords) {
      if (w.main_word_index === undefined || w.main_word_index === null)
        continue;
      const idx = w.main_word_index;
      if (idx < 0 || idx >= w.word.length) continue;
      const dx = w.direction === "across" ? 1 : 0;
      const dy = w.direction === "down" ? 1 : 0;
      const row = w.y + idx * dy;
      const col = w.x + idx * dx;
      const letter = w.word[idx].toUpperCase();

      // Match to main word position
      for (let mi = 0; mi < mainWordUpper.length; mi++) {
        if (!used.has(mi) && mainWordUpper[mi] === letter) {
          mainWordCells.push({ row, col, letterIndex: mi });
          used.add(mi);
          break;
        }
      }
    }

    mainWordData = {
      word: mainWordUpper,
      cells: mainWordCells.sort((a, b) => a.letterIndex - b.letterIndex),
    };
  }

  return {
    cells,
    clues,
    gridWidth: trimmedCols,
    gridHeight: trimmedRows,
    gridSize: Math.max(trimmedCols, trimmedRows),
    seed: layout.seed,
    answers: {
      cells: answerCells,
      words: answerWords,
    },
    mainWord: mainWordData,
  };
};

/**
 * Validate user answers against the stored layout.
 * Returns per-word results without revealing unchecked answers.
 */
export const validateAnswers = (
  layout: PreComputedLayout,
  userAnswers: Record<string, string>,
): {
  correct: number;
  total: number;
  solvedWords: { number: number; direction: "across" | "down" }[];
} => {
  let correct = 0;
  let total = 0;

  // Count individual cells
  for (const [cellKey, expectedLetter] of Object.entries(
    layout.answers.cells,
  )) {
    total++;
    const userLetter = (userAnswers[cellKey] || "").toUpperCase();
    if (userLetter === expectedLetter) {
      correct++;
    }
  }

  // Find fully solved words
  const solvedWords: { number: number; direction: "across" | "down" }[] = [];
  for (const word of layout.answers.words) {
    let allCorrect = true;
    for (let i = 0; i < word.cells.length; i++) {
      const cellKey = word.cells[i];
      const userLetter = (userAnswers[cellKey] || "").toUpperCase();
      if (userLetter !== word.word[i]) {
        allCorrect = false;
        break;
      }
    }
    if (allCorrect) {
      solvedWords.push({ number: word.number, direction: word.direction });
    }
  }

  return { correct, total, solvedWords };
};
