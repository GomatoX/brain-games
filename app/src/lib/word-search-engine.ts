/**
 * Word Search Grid Generation Engine
 *
 * Generates an NxN letter grid with words placed in various directions.
 * Supports any Unicode alphabet — language-agnostic by design.
 */

export interface WordInput {
  word: string
  hint?: string
}

export interface PlacedWord {
  word: string
  hint?: string
  startRow: number
  startCol: number
  endRow: number
  endCol: number
  direction: Direction
}

export interface WordSearchLayout {
  grid: string[][]
  gridSize: number
  placedWords: PlacedWord[]
}

type Direction = [number, number]

// All 8 possible directions: [rowDelta, colDelta]
const ALL_DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
  [0, -1],  // left
  [-1, 0],  // up
  [-1, -1], // diagonal up-left
  [-1, 1],  // diagonal up-right
]

const DIRECTION_SETS: Record<string, Direction[]> = {
  Easy: ALL_DIRECTIONS.slice(0, 4),   // right, down, diag-DR, diag-DL
  Medium: ALL_DIRECTIONS.slice(0, 6), // + left, up
  Hard: ALL_DIRECTIONS,               // all 8
}

/**
 * Seeded pseudo-random number generator (Mulberry32)
 * Ensures deterministic grid generation for the same seed.
 */
const createRng = (seed: number) => {
  let s = seed | 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Extract the unique character set from the word list.
 * Used to generate filler letters in the same alphabet.
 */
const extractAlphabet = (words: WordInput[]): string[] => {
  const chars = new Set<string>()
  for (const { word } of words) {
    for (const ch of word.toUpperCase()) {
      if (ch.trim()) chars.add(ch)
    }
  }
  // Fallback to Latin if somehow empty
  if (chars.size === 0) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
  }
  return [...chars]
}

/**
 * Calculate grid size based on the longest word and word count.
 */
const calculateGridSize = (
  words: WordInput[],
  difficulty: string,
): number => {
  const longestWord = Math.max(...words.map((w) => w.word.length))
  const wordCount = words.length

  const basePadding =
    difficulty === "Easy" ? 4 : difficulty === "Hard" ? 2 : 3

  // Grid must be at least as large as the longest word
  // Add padding based on word count to give room for placement
  const fromWords = Math.ceil(Math.sqrt(wordCount * longestWord * 1.5))
  const minSize = Math.max(longestWord + basePadding, fromWords)

  // Clamp between 8 and 20
  return Math.max(8, Math.min(20, minSize))
}

/**
 * Try to place a single word on the grid.
 * Returns the placed position or null if placement failed.
 */
const tryPlaceWord = (
  grid: string[][],
  word: string,
  size: number,
  directions: Direction[],
  rng: () => number,
): PlacedWord | null => {
  const upperWord = word.toUpperCase()
  const len = upperWord.length

  // Shuffle directions for randomness
  const shuffledDirs = [...directions].sort(() => rng() - 0.5)

  // Try up to 200 random positions per direction
  for (const [dr, dc] of shuffledDirs) {
    for (let attempt = 0; attempt < 200; attempt++) {
      const startRow = Math.floor(rng() * size)
      const startCol = Math.floor(rng() * size)

      // Check if word fits within bounds
      const endRow = startRow + dr * (len - 1)
      const endCol = startCol + dc * (len - 1)

      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        continue
      }

      // Check if all cells are available (empty or matching letter)
      let canPlace = true
      for (let i = 0; i < len; i++) {
        const r = startRow + dr * i
        const c = startCol + dc * i
        const existing = grid[r][c]
        if (existing !== "" && existing !== upperWord[i]) {
          canPlace = false
          break
        }
      }

      if (!canPlace) continue

      // Place the word
      for (let i = 0; i < len; i++) {
        const r = startRow + dr * i
        const c = startCol + dc * i
        grid[r][c] = upperWord[i]
      }

      return {
        word: upperWord,
        startRow,
        startCol,
        endRow,
        endCol,
        direction: [dr, dc],
      }
    }
  }

  return null
}

/**
 * Generate a word search grid.
 *
 * @param words - Array of words to place in the grid
 * @param difficulty - "Easy" | "Medium" | "Hard"
 * @param seed - Optional seed for deterministic generation
 */
export const generateWordSearchGrid = (
  words: WordInput[],
  difficulty = "Medium",
  seed?: number,
): WordSearchLayout => {
  if (!words || words.length === 0) {
    return { grid: [], gridSize: 0, placedWords: [] }
  }

  const actualSeed = seed ?? Math.floor(Math.random() * 2147483647)
  const rng = createRng(actualSeed)
  const directions = DIRECTION_SETS[difficulty] || DIRECTION_SETS.Medium
  const alphabet = extractAlphabet(words)
  const gridSize = calculateGridSize(words, difficulty)

  // Best result across multiple attempts
  let bestGrid: string[][] = []
  let bestPlaced: PlacedWord[] = []

  // Try multiple full attempts to maximize words placed
  const maxAttempts = 50
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const grid: string[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ""),
    )
    const placed: PlacedWord[] = []

    // Sort words by length (longest first) for better placement
    const sortedWords = [...words].sort(
      (a, b) => b.word.length - a.word.length,
    )

    for (const wordInput of sortedWords) {
      const result = tryPlaceWord(
        grid,
        wordInput.word,
        gridSize,
        directions,
        rng,
      )
      if (result) {
        result.hint = wordInput.hint
        placed.push(result)
      }
    }

    if (placed.length > bestPlaced.length) {
      bestGrid = grid
      bestPlaced = placed
    }

    // If all words placed, no need to try more
    if (placed.length === words.length) break
  }

  // Fill empty cells with random filler letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (bestGrid[r][c] === "") {
        bestGrid[r][c] = alphabet[Math.floor(rng() * alphabet.length)]
      }
    }
  }

  return {
    grid: bestGrid,
    gridSize,
    placedWords: bestPlaced,
  }
}

/**
 * Validate a user's found word against the placed words.
 * Returns the matched word or null.
 */
export const validateFoundWord = (
  placedWords: PlacedWord[],
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number,
): PlacedWord | null => {
  for (const pw of placedWords) {
    // Check forward match
    if (
      pw.startRow === startRow &&
      pw.startCol === startCol &&
      pw.endRow === endRow &&
      pw.endCol === endCol
    ) {
      return pw
    }
    // Check reverse match (user dragged in opposite direction)
    if (
      pw.startRow === endRow &&
      pw.startCol === endCol &&
      pw.endRow === startRow &&
      pw.endCol === startCol
    ) {
      return pw
    }
  }
  return null
}
