import { describe, it, expect } from "vitest"
import {
  generateWordSearchGrid,
  validateFoundWord,
} from "@/lib/word-search-engine"
import type { WordInput } from "@/lib/word-search-engine"

// ─── Test Fixtures ────────────────────────────────────────

const SIMPLE_WORDS: WordInput[] = [
  { word: "CAT", hint: "A furry pet" },
  { word: "DOG", hint: "Man's best friend" },
  { word: "BIRD", hint: "It can fly" },
]

const MEDIUM_WORDS: WordInput[] = [
  { word: "PYTHON" },
  { word: "JAVASCRIPT" },
  { word: "RUST" },
  { word: "GOLANG" },
  { word: "SWIFT" },
  { word: "KOTLIN" },
]

const LITHUANIAN_WORDS: WordInput[] = [
  { word: "KATĖ", hint: "Naminė katė" },
  { word: "ŠUO", hint: "Geriausias draugas" },
  { word: "ŽUVIS", hint: "Gyvena vandenyje" },
  { word: "ĄŽUOLAS", hint: "Didelis medis" },
]

const SINGLE_WORD: WordInput[] = [{ word: "HELLO" }]

// ─── Grid Generation Tests ───────────────────────────────

describe("generateWordSearchGrid", () => {
  describe("basic generation", () => {
    it("should generate a grid for simple words", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS)

      expect(result.grid).toBeDefined()
      expect(result.gridSize).toBeGreaterThan(0)
      expect(result.placedWords.length).toBeGreaterThan(0)
    })

    it("should place all simple words", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)

      expect(result.placedWords.length).toBe(SIMPLE_WORDS.length)
    })

    it("should generate a square grid", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS)

      expect(result.grid.length).toBe(result.gridSize)
      for (const row of result.grid) {
        expect(row.length).toBe(result.gridSize)
      }
    })

    it("should fill all cells (no empty cells)", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)

      for (let r = 0; r < result.gridSize; r++) {
        for (let c = 0; c < result.gridSize; c++) {
          expect(result.grid[r][c]).toBeTruthy()
          expect(result.grid[r][c].length).toBe(1)
        }
      }
    })

    it("should handle a single word", () => {
      const result = generateWordSearchGrid(SINGLE_WORD)

      expect(result.placedWords.length).toBe(1)
      expect(result.placedWords[0].word).toBe("HELLO")
    })

    it("should handle empty input", () => {
      const result = generateWordSearchGrid([])

      expect(result.grid).toEqual([])
      expect(result.gridSize).toBe(0)
      expect(result.placedWords).toEqual([])
    })
  })

  describe("word placement verification", () => {
    it("should correctly place words in the grid", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Easy", 42)

      for (const pw of result.placedWords) {
        const [dr, dc] = pw.direction
        let extractedWord = ""
        for (let i = 0; i < pw.word.length; i++) {
          const r = pw.startRow + dr * i
          const c = pw.startCol + dc * i
          extractedWord += result.grid[r][c]
        }
        expect(extractedWord).toBe(pw.word)
      }
    })

    it("should keep words within grid bounds", () => {
      const result = generateWordSearchGrid(MEDIUM_WORDS, "Hard", 42)

      for (const pw of result.placedWords) {
        expect(pw.startRow).toBeGreaterThanOrEqual(0)
        expect(pw.startCol).toBeGreaterThanOrEqual(0)
        expect(pw.endRow).toBeGreaterThanOrEqual(0)
        expect(pw.endCol).toBeGreaterThanOrEqual(0)
        expect(pw.startRow).toBeLessThan(result.gridSize)
        expect(pw.startCol).toBeLessThan(result.gridSize)
        expect(pw.endRow).toBeLessThan(result.gridSize)
        expect(pw.endCol).toBeLessThan(result.gridSize)
      }
    })

    it("should preserve hints in placed words", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)

      const catWord = result.placedWords.find((w) => w.word === "CAT")
      expect(catWord?.hint).toBe("A furry pet")
    })
  })

  describe("difficulty levels", () => {
    it("should place all words on Easy difficulty", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Easy", 42)
      expect(result.placedWords.length).toBe(SIMPLE_WORDS.length)
    })

    it("should place all words on Medium difficulty", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)
      expect(result.placedWords.length).toBe(SIMPLE_WORDS.length)
    })

    it("should place all words on Hard difficulty", () => {
      const result = generateWordSearchGrid(SIMPLE_WORDS, "Hard", 42)
      expect(result.placedWords.length).toBe(SIMPLE_WORDS.length)
    })
  })

  describe("deterministic output", () => {
    it("should produce the same grid for the same seed", () => {
      const result1 = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)
      const result2 = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)

      expect(result1.grid).toEqual(result2.grid)
      expect(result1.gridSize).toBe(result2.gridSize)
      expect(result1.placedWords.length).toBe(result2.placedWords.length)
    })

    it("should produce different grids for different seeds", () => {
      const result1 = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 42)
      const result2 = generateWordSearchGrid(SIMPLE_WORDS, "Medium", 123)

      // Grids should likely differ (not guaranteed, but extremely unlikely to match)
      const grid1Str = JSON.stringify(result1.grid)
      const grid2Str = JSON.stringify(result2.grid)
      expect(grid1Str).not.toBe(grid2Str)
    })
  })

  describe("Unicode / multi-language support", () => {
    it("should handle Lithuanian characters (diacritics)", () => {
      const result = generateWordSearchGrid(LITHUANIAN_WORDS, "Easy", 42)

      expect(result.placedWords.length).toBeGreaterThan(0)

      // Verify diacritics are preserved in the grid
      const allLetters = result.grid.flat().join("")
      // Should contain at least some Lithuanian diacritics from the words
      const placedLetters = result.placedWords
        .map((w) => w.word)
        .join("")
      for (const letter of placedLetters) {
        expect(allLetters).toContain(letter)
      }
    })

    it("should use word characters as filler alphabet", () => {
      const result = generateWordSearchGrid(LITHUANIAN_WORDS, "Easy", 42)

      // Extract unique chars from words
      const wordChars = new Set()
      for (const w of LITHUANIAN_WORDS) {
        for (const ch of w.word.toUpperCase()) {
          if (ch.trim()) wordChars.add(ch)
        }
      }

      // All filler characters should be from the word alphabet
      for (const row of result.grid) {
        for (const cell of row) {
          expect(wordChars.has(cell)).toBe(true)
        }
      }
    })
  })

  describe("grid sizing", () => {
    it("should have grid at least as large as the longest word", () => {
      const result = generateWordSearchGrid(MEDIUM_WORDS, "Medium", 42)
      const longestWord = Math.max(...MEDIUM_WORDS.map((w) => w.word.length))

      expect(result.gridSize).toBeGreaterThanOrEqual(longestWord)
    })

    it("should clamp grid size between 8 and 20", () => {
      const result = generateWordSearchGrid(SINGLE_WORD)

      expect(result.gridSize).toBeGreaterThanOrEqual(8)
      expect(result.gridSize).toBeLessThanOrEqual(20)
    })
  })

  describe("medium complexity", () => {
    it("should place most or all medium words", () => {
      const result = generateWordSearchGrid(MEDIUM_WORDS, "Medium", 42)

      // Allow at most 1 unplaced word
      expect(result.placedWords.length).toBeGreaterThanOrEqual(
        MEDIUM_WORDS.length - 1,
      )
    })
  })
})

// ─── Word Validation Tests ───────────────────────────────

describe("validateFoundWord", () => {
  const placedWords = [
    {
      word: "CAT",
      startRow: 0,
      startCol: 0,
      endRow: 0,
      endCol: 2,
      direction: [0, 1] as [number, number],
    },
    {
      word: "DOG",
      startRow: 2,
      startCol: 1,
      endRow: 4,
      endCol: 1,
      direction: [1, 0] as [number, number],
    },
  ]

  it("should validate a correct forward selection", () => {
    const match = validateFoundWord(placedWords, 0, 0, 0, 2)
    expect(match).toBeDefined()
    expect(match?.word).toBe("CAT")
  })

  it("should validate a correct reverse selection", () => {
    const match = validateFoundWord(placedWords, 0, 2, 0, 0)
    expect(match).toBeDefined()
    expect(match?.word).toBe("CAT")
  })

  it("should return null for an incorrect selection", () => {
    const match = validateFoundWord(placedWords, 0, 0, 2, 2)
    expect(match).toBeNull()
  })

  it("should validate a vertical word", () => {
    const match = validateFoundWord(placedWords, 2, 1, 4, 1)
    expect(match).toBeDefined()
    expect(match?.word).toBe("DOG")
  })
})
