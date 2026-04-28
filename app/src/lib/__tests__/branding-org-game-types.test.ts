import { describe, it, expect, vi } from "vitest"

vi.mock("@/db", () => ({ db: {} }))
vi.mock("@/db/schema", () => ({
  crosswords: { orgId: "org_id" },
  wordgames: { orgId: "org_id" },
  wordsearches: { orgId: "org_id" },
  sudoku: { orgId: "org_id" },
}))

import { pickPreviewGameType } from "@/lib/branding/org-game-types"

describe("pickPreviewGameType", () => {
  it("returns null when no types are available", () => {
    expect(pickPreviewGameType(new Set())).toBeNull()
  })

  it("prefers crossword over everything else", () => {
    expect(pickPreviewGameType(new Set(["crossword", "wordgame", "wordsearch"]))).toBe(
      "crossword",
    )
  })

  it("falls back to wordgame when crossword is missing", () => {
    expect(pickPreviewGameType(new Set(["wordgame", "wordsearch"]))).toBe("wordgame")
  })

  it("returns wordsearch as last resort", () => {
    expect(pickPreviewGameType(new Set(["wordsearch"]))).toBe("wordsearch")
  })

  it("ignores 'sudoku' until the engine ships", () => {
    // Sudoku is in the set but has no IIFE bundle — skip it
    expect(pickPreviewGameType(new Set(["sudoku"]))).toBeNull()
    expect(pickPreviewGameType(new Set(["sudoku", "wordgame"]))).toBe("wordgame")
  })
})
