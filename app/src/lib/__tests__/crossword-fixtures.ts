/**
 * Premade crossword test fixtures
 *
 * These are carefully designed word sets with known properties
 * for deterministic testing of the layout engine and validation.
 */

import type { PreComputedLayout } from "@/lib/crossword-layout-server";

// ─── Simple 4-word crossword ──────────────────────────────
// Designed for high intersection potential:
//
//     C A T S
//     A
//     R O S E
//     S
//
// CATS (across), CARS (down), ROSE (across), share common letters.

export const SIMPLE_WORDS = [
  { word: "CATS", clue: "Feline pets" },
  { word: "CARS", clue: "Motor vehicles" },
  { word: "ROSE", clue: "A red flower" },
  { word: "STAR", clue: "Celestial body" },
];

// ─── Medium 8-word crossword ──────────────────────────────
// More words with good intersection density potential.

export const MEDIUM_WORDS = [
  { word: "PLANET", clue: "Orbiting body" },
  { word: "LASER", clue: "Focused beam" },
  { word: "TABLE", clue: "Furniture piece" },
  { word: "EAGLE", clue: "Majestic bird" },
  { word: "NOTES", clue: "Written memos" },
  { word: "STONE", clue: "A small rock" },
  { word: "LEARN", clue: "To study" },
  { word: "ALIEN", clue: "Extraterrestrial" },
];

// ─── Large 12-word crossword ──────────────────────────────
// Stress test with varied word lengths.

export const LARGE_WORDS = [
  { word: "ELEPHANT", clue: "Large mammal" },
  { word: "TRIANGLE", clue: "Three-sided shape" },
  { word: "CASTLE", clue: "Medieval fortress" },
  { word: "GARDEN", clue: "Outdoor space" },
  { word: "BRIDGE", clue: "River crossing" },
  { word: "PLANET", clue: "Orbiting body" },
  { word: "STREAM", clue: "Small river" },
  { word: "PENCIL", clue: "Writing tool" },
  { word: "ISLAND", clue: "Land in water" },
  { word: "CANDLE", clue: "Wax light" },
  { word: "BASKET", clue: "Woven container" },
  { word: "SILVER", clue: "Precious metal" },
];

// ─── Crossword with main word ─────────────────────────────
// Tests the main word feature where specific letters from
// each word combine to form a hidden word.

export const MAIN_WORD_CROSSWORD = {
  words: [
    { word: "HEART", clue: "Vital organ", main_word_index: 0 }, // H
    { word: "OCEAN", clue: "Large body of water", main_word_index: 3 }, // A
    { word: "PROUD", clue: "Feeling of achievement", main_word_index: 0 }, // P
    { word: "RAPID", clue: "Very fast", main_word_index: 3 }, // I
    { word: "STYLE", clue: "Fashion sense", main_word_index: 4 }, // E
  ],
  mainWord: "HAPIE", // Not a real word, just for testing letter extraction
};

// ─── Minimal crossword (edge case) ───────────────────────

export const MINIMAL_WORDS = [{ word: "CAT", clue: "A feline" }];

// ─── Words designed for low intersection potential ────────
// All words share very few common letters to stress-test the engine.

export const HARD_TO_INTERSECT = [
  { word: "BUZZ", clue: "Sound a bee makes" },
  { word: "JINX", clue: "Bad luck charm" },
  { word: "MYTH", clue: "Ancient story" },
  { word: "FLUX", clue: "Constant change" },
  { word: "QUIP", clue: "Witty remark" },
];

// ─── Helper: Build a known layout for validation tests ────
// This creates a deterministic layout that tests can use
// without running the layout algorithm.

export const buildKnownLayout = (): PreComputedLayout => ({
  cells: [
    // Row 0: C A T S
    { row: 0, col: 0, isBlocked: false, number: 1 },
    { row: 0, col: 1, isBlocked: false, number: null },
    { row: 0, col: 2, isBlocked: false, number: null },
    { row: 0, col: 3, isBlocked: false, number: 2 },
    // Row 1: A . . T
    { row: 1, col: 0, isBlocked: false, number: null },
    { row: 1, col: 1, isBlocked: true, number: null },
    { row: 1, col: 2, isBlocked: true, number: null },
    { row: 1, col: 3, isBlocked: false, number: null },
    // Row 2: R O S E
    { row: 2, col: 0, isBlocked: false, number: 3 },
    { row: 2, col: 1, isBlocked: false, number: null },
    { row: 2, col: 2, isBlocked: false, number: null },
    { row: 2, col: 3, isBlocked: false, number: null },
    // Row 3: S . . R
    { row: 3, col: 0, isBlocked: false, number: null },
    { row: 3, col: 1, isBlocked: true, number: null },
    { row: 3, col: 2, isBlocked: true, number: null },
    { row: 3, col: 3, isBlocked: false, number: null },
  ],
  clues: [
    {
      number: 1,
      clue: "Feline pets",
      direction: "across",
      startRow: 0,
      startCol: 0,
      length: 4,
    },
    {
      number: 2,
      clue: "Celestial body",
      direction: "down",
      startRow: 0,
      startCol: 3,
      length: 4,
    },
    {
      number: 1,
      clue: "Motor vehicles",
      direction: "down",
      startRow: 0,
      startCol: 0,
      length: 4,
    },
    {
      number: 3,
      clue: "A red flower",
      direction: "across",
      startRow: 2,
      startCol: 0,
      length: 4,
    },
  ],
  gridWidth: 4,
  gridHeight: 4,
  gridSize: 4,
  seed: 1,
  answers: {
    cells: {
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
    },
    words: [
      {
        number: 1,
        direction: "across",
        word: "CATS",
        cells: ["0,0", "0,1", "0,2", "0,3"],
      },
      {
        number: 1,
        direction: "down",
        word: "CARS",
        cells: ["0,0", "1,0", "2,0", "3,0"],
      },
      {
        number: 3,
        direction: "across",
        word: "ROSE",
        cells: ["2,0", "2,1", "2,2", "2,3"],
      },
      {
        number: 2,
        direction: "down",
        word: "STER",
        cells: ["0,3", "1,3", "2,3", "3,3"],
      },
    ],
  },
});
