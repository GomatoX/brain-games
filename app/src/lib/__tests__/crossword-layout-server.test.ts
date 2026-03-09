import { describe, it, expect } from "vitest";
import {
  computeCrosswordLayout,
  validateAnswers,
} from "@/lib/crossword-layout-server";
import type { PreComputedLayout } from "@/lib/crossword-layout-server";
import {
  SIMPLE_WORDS,
  MEDIUM_WORDS,
  LARGE_WORDS,
  MAIN_WORD_CROSSWORD,
  MINIMAL_WORDS,
  HARD_TO_INTERSECT,
  buildKnownLayout,
} from "./crossword-fixtures";

// ─── Layout Generation Tests ──────────────────────────────

describe("computeCrosswordLayout", () => {
  describe("basic layout generation", () => {
    it("should generate a layout for simple words", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      expect(layout).toBeDefined();
      expect(layout.cells.length).toBeGreaterThan(0);
      expect(layout.clues.length).toBeGreaterThan(0);
      expect(layout.gridWidth).toBeGreaterThan(0);
      expect(layout.gridHeight).toBeGreaterThan(0);
      expect(layout.gridSize).toBeGreaterThan(0);
    });

    it("should place all simple words", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      // All 4 words should be placed as clues
      expect(layout.clues.length).toBe(SIMPLE_WORDS.length);
    });

    it("should generate both across and down clues", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      const acrossClues = layout.clues.filter((c) => c.direction === "across");
      const downClues = layout.clues.filter((c) => c.direction === "down");

      expect(acrossClues.length).toBeGreaterThan(0);
      expect(downClues.length).toBeGreaterThan(0);
    });

    it("should generate correct answer data for validation", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      // answers.cells should have entries
      expect(Object.keys(layout.answers.cells).length).toBeGreaterThan(0);

      // answers.words should have entries matching clues
      expect(layout.answers.words.length).toBe(layout.clues.length);

      // Each word should have valid cell references
      for (const word of layout.answers.words) {
        expect(word.word.length).toBeGreaterThan(0);
        expect(word.cells.length).toBe(word.word.length);
        expect(word.number).toBeGreaterThan(0);
        expect(["across", "down"]).toContain(word.direction);
      }
    });

    it("should handle a single word", () => {
      const layout = computeCrosswordLayout(MINIMAL_WORDS);

      expect(layout.clues.length).toBe(1);
      expect(layout.clues[0].length).toBe(3); // "CAT" = 3 letters
      expect(layout.answers.words[0].word).toBe("CAT");
    });
  });

  describe("medium complexity", () => {
    it("should place all medium words", () => {
      const layout = computeCrosswordLayout(MEDIUM_WORDS);

      expect(layout.clues.length).toBe(MEDIUM_WORDS.length);
    });

    it("should achieve reasonable density for medium words", () => {
      const layout = computeCrosswordLayout(MEDIUM_WORDS);

      const totalCells = layout.gridWidth * layout.gridHeight;
      const letterCells = layout.cells.filter((c) => !c.isBlocked).length;
      const density = letterCells / totalCells;

      // Expect at least 30% density for 8 words
      expect(density).toBeGreaterThan(0.3);
    });
  });

  describe("large complexity", () => {
    it("should place most or all large words", () => {
      const layout = computeCrosswordLayout(LARGE_WORDS);

      // Allow at most 2 unplaced words for difficult sets
      expect(layout.clues.length).toBeGreaterThanOrEqual(
        LARGE_WORDS.length - 2,
      );
    });

    it("should produce a compact grid for large words", () => {
      const layout = computeCrosswordLayout(LARGE_WORDS);

      // Grid shouldn't be excessively large
      expect(layout.gridSize).toBeLessThanOrEqual(30);
    });
  });

  describe("hard to intersect words", () => {
    it("should handle words with few common letters", () => {
      const layout = computeCrosswordLayout(HARD_TO_INTERSECT);

      // Engine should still produce a valid layout
      expect(layout.cells.length).toBeGreaterThan(0);
      expect(layout.clues.length).toBeGreaterThan(0);
    });
  });

  describe("cell numbering", () => {
    it("should assign sequential numbers to word starts", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      const numberedCells = layout.cells.filter((c) => c.number !== null);

      // Each number should be unique
      const numbers = numberedCells.map((c) => c.number);
      const uniqueNumbers = new Set(numbers);
      expect(uniqueNumbers.size).toBe(numbers.length);

      // Numbers should start at 1
      expect(Math.min(...(numbers as number[]))).toBe(1);
    });

    it("should assign numbers in reading order (top-to-bottom, left-to-right)", () => {
      const layout = computeCrosswordLayout(MEDIUM_WORDS);

      const numberedCells = layout.cells
        .filter((c) => c.number !== null)
        .sort((a, b) => a.number! - b.number!);

      // Verify reading order: earlier numbers should be at earlier positions
      for (let i = 1; i < numberedCells.length; i++) {
        const prev = numberedCells[i - 1];
        const curr = numberedCells[i];
        const prevPos = prev.row * layout.gridWidth + prev.col;
        const currPos = curr.row * layout.gridWidth + curr.col;
        expect(currPos).toBeGreaterThanOrEqual(prevPos);
      }
    });
  });

  describe("clue data integrity", () => {
    it("should include correct clue text from input", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      const clueTexts = layout.clues.map((c) => c.clue);
      for (const word of SIMPLE_WORDS) {
        expect(clueTexts).toContain(word.clue);
      }
    });

    it("should have consistent clue start positions", () => {
      const layout = computeCrosswordLayout(SIMPLE_WORDS);

      for (const clue of layout.clues) {
        // Start position should be within grid bounds
        expect(clue.startRow).toBeGreaterThanOrEqual(0);
        expect(clue.startCol).toBeGreaterThanOrEqual(0);
        expect(clue.startRow).toBeLessThan(layout.gridHeight);
        expect(clue.startCol).toBeLessThan(layout.gridWidth);

        // Word should fit within grid
        if (clue.direction === "across") {
          expect(clue.startCol + clue.length).toBeLessThanOrEqual(
            layout.gridWidth,
          );
        } else {
          expect(clue.startRow + clue.length).toBeLessThanOrEqual(
            layout.gridHeight,
          );
        }
      }
    });
  });

  describe("deterministic output", () => {
    it("should produce the same layout for the same seed", () => {
      const layout1 = computeCrosswordLayout(SIMPLE_WORDS, null, 42);
      const layout2 = computeCrosswordLayout(SIMPLE_WORDS, null, 42);

      expect(layout1.gridWidth).toBe(layout2.gridWidth);
      expect(layout1.gridHeight).toBe(layout2.gridHeight);
      expect(layout1.clues.length).toBe(layout2.clues.length);
      expect(layout1.answers.cells).toEqual(layout2.answers.cells);
    });
  });
});

// ─── Main Word Feature Tests ──────────────────────────────

describe("main word feature", () => {
  it("should compute main word metadata", () => {
    const layout = computeCrosswordLayout(
      MAIN_WORD_CROSSWORD.words,
      MAIN_WORD_CROSSWORD.mainWord,
    );

    expect(layout.mainWord).toBeDefined();
    expect(layout.mainWord!.word).toBe(
      MAIN_WORD_CROSSWORD.mainWord.toUpperCase(),
    );
  });

  it("should map main word cells correctly", () => {
    const layout = computeCrosswordLayout(
      MAIN_WORD_CROSSWORD.words,
      MAIN_WORD_CROSSWORD.mainWord,
    );

    if (layout.mainWord) {
      // Each cell should reference a valid grid position
      for (const cell of layout.mainWord.cells) {
        expect(cell.row).toBeGreaterThanOrEqual(0);
        expect(cell.col).toBeGreaterThanOrEqual(0);
        expect(cell.letterIndex).toBeGreaterThanOrEqual(0);
        expect(cell.letterIndex).toBeLessThan(layout.mainWord.word.length);
      }
    }
  });

  it("should not include main word when not provided", () => {
    const layout = computeCrosswordLayout(SIMPLE_WORDS);

    expect(layout.mainWord).toBeUndefined();
  });
});

// ─── Answer Validation Tests ──────────────────────────────

describe("validateAnswers", () => {
  const knownLayout = buildKnownLayout();

  describe("correct answers", () => {
    it("should validate all correct answers", () => {
      const result = validateAnswers(knownLayout, {
        "0,0": "C",
        "0,1": "A",
        "0,2": "T",
        "0,3": "S",
        "1,0": "A",
        "1,3": "T",
        "2,0": "R",
        "2,1": "O",
        "2,2": "S",
        "2,3": "E",
        "3,0": "S",
        "3,3": "R",
      });

      expect(result.correct).toBe(result.total);
      expect(result.solvedWords.length).toBe(4);
    });

    it("should identify individual solved words", () => {
      // Only fill CATS (across) correctly
      const result = validateAnswers(knownLayout, {
        "0,0": "C",
        "0,1": "A",
        "0,2": "T",
        "0,3": "S",
      });

      const catsWord = result.solvedWords.find(
        (w) => w.number === 1 && w.direction === "across",
      );
      expect(catsWord).toBeDefined();
    });
  });

  describe("incorrect answers", () => {
    it("should count incorrect cells", () => {
      const result = validateAnswers(knownLayout, {
        "0,0": "X", // Wrong
        "0,1": "A",
        "0,2": "T",
        "0,3": "S",
      });

      expect(result.correct).toBeLessThan(result.total);
    });

    it("should not mark word as solved with one wrong letter", () => {
      const result = validateAnswers(knownLayout, {
        "0,0": "X", // Wrong - breaks both CATS and CARS
        "0,1": "A",
        "0,2": "T",
        "0,3": "S",
        "1,0": "A",
        "2,0": "R",
        "3,0": "S",
      });

      const catsWord = result.solvedWords.find(
        (w) => w.number === 1 && w.direction === "across",
      );
      const carsWord = result.solvedWords.find(
        (w) => w.number === 1 && w.direction === "down",
      );

      expect(catsWord).toBeUndefined();
      expect(carsWord).toBeUndefined();
    });
  });

  describe("empty answers", () => {
    it("should handle empty answer submission", () => {
      const result = validateAnswers(knownLayout, {});

      expect(result.correct).toBe(0);
      expect(result.total).toBe(12); // 12 letter cells
      expect(result.solvedWords.length).toBe(0);
    });
  });

  describe("partial answers", () => {
    it("should handle partially filled crossword", () => {
      const result = validateAnswers(knownLayout, {
        "0,0": "C",
        "0,1": "A",
        // Rest empty
      });

      expect(result.correct).toBe(2);
      expect(result.total).toBe(12);
    });

    it("should solve a word even when other cells are empty", () => {
      // Fill ROSE (row 2) completely and correctly
      const result = validateAnswers(knownLayout, {
        "2,0": "R",
        "2,1": "O",
        "2,2": "S",
        "2,3": "E",
      });

      const roseWord = result.solvedWords.find(
        (w) => w.number === 3 && w.direction === "across",
      );
      expect(roseWord).toBeDefined();
    });
  });

  describe("case insensitivity", () => {
    it("should accept lowercase answers", () => {
      const result = validateAnswers(knownLayout, {
        "0,0": "c",
        "0,1": "a",
        "0,2": "t",
        "0,3": "s",
      });

      const catsWord = result.solvedWords.find(
        (w) => w.number === 1 && w.direction === "across",
      );
      expect(catsWord).toBeDefined();
    });
  });
});

// ─── Anti-Cheat: Layout Structure Tests ───────────────────

describe("anti-cheat layout structure", () => {
  it("should not contain answer letters in cells", () => {
    const layout = computeCrosswordLayout(SIMPLE_WORDS);

    // The cells array should only have structure, no letter content
    for (const cell of layout.cells) {
      expect(cell).not.toHaveProperty("letter");
      expect(cell).toHaveProperty("isBlocked");
      expect(cell).toHaveProperty("number");
      expect(cell).toHaveProperty("row");
      expect(cell).toHaveProperty("col");
    }
  });

  it("should not contain word answers in clues", () => {
    const layout = computeCrosswordLayout(SIMPLE_WORDS);

    for (const clue of layout.clues) {
      expect(clue).not.toHaveProperty("word");
      expect(clue).not.toHaveProperty("answer");
      expect(clue).toHaveProperty("clue");
      expect(clue).toHaveProperty("length");
    }
  });

  it("should store answers separately for server-side validation", () => {
    const layout = computeCrosswordLayout(SIMPLE_WORDS);

    // Answers should exist in the answers object
    expect(layout.answers).toBeDefined();
    expect(Object.keys(layout.answers.cells).length).toBeGreaterThan(0);
    expect(layout.answers.words.length).toBeGreaterThan(0);

    // Each answer word should have the full word text
    for (const word of layout.answers.words) {
      expect(word.word.length).toBeGreaterThan(0);
      expect(word.word).toMatch(/^[A-Z]+$/);
    }
  });

  it("should have consistent cell count between cells array and answers", () => {
    const layout = computeCrosswordLayout(MEDIUM_WORDS);

    const nonBlockedCells = layout.cells.filter((c) => !c.isBlocked);
    const answerCells = Object.keys(layout.answers.cells);

    expect(nonBlockedCells.length).toBe(answerCells.length);
  });

  it("public layout data should be safe to send to client", () => {
    const layout = computeCrosswordLayout(MEDIUM_WORDS);

    // Simulate what the API sends (without answers)
    const publicData = {
      cells: layout.cells,
      clues: layout.clues,
      gridWidth: layout.gridWidth,
      gridHeight: layout.gridHeight,
      gridSize: layout.gridSize,
      seed: layout.seed,
    };

    // Serialize and check no answer content leaked
    const jsonStr = JSON.stringify(publicData);

    // Should not contain any of the actual word answers
    for (const word of MEDIUM_WORDS) {
      // Full uppercase words shouldn't appear in the public data
      // (they could appear as substrings of clues, so check specifically)
      const publicObj = JSON.parse(jsonStr);
      for (const clue of publicObj.clues) {
        expect(clue).not.toHaveProperty("word");
      }
      for (const cell of publicObj.cells) {
        expect(cell).not.toHaveProperty("letter");
      }
    }
  });
});

// ─── Density Tests ────────────────────────────────────────

describe("grid density", () => {
  it("should achieve reasonable density for simple words", () => {
    const layout = computeCrosswordLayout(SIMPLE_WORDS);
    const totalCells = layout.gridWidth * layout.gridHeight;
    const letterCells = Object.keys(layout.answers.cells).length;
    const density = letterCells / totalCells;

    expect(density).toBeGreaterThan(0.2);
  });

  it("should achieve good density for medium words", () => {
    const layout = computeCrosswordLayout(MEDIUM_WORDS);
    const totalCells = layout.gridWidth * layout.gridHeight;
    const letterCells = Object.keys(layout.answers.cells).length;
    const density = letterCells / totalCells;

    // With tuned parameters, medium words should get decent density
    expect(density).toBeGreaterThan(0.3);
  });

  it("should not produce excessively sparse grids", () => {
    const layout = computeCrosswordLayout(LARGE_WORDS);
    const totalCells = layout.gridWidth * layout.gridHeight;
    const letterCells = Object.keys(layout.answers.cells).length;
    const density = letterCells / totalCells;

    expect(density).toBeGreaterThan(0.15);
  });
});
