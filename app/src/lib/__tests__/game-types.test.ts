import { describe, it, expect } from "vitest"
import { mapGame } from "../game-types"

describe("mapGame", () => {
  it("maps camelCase DB row to snake_case Game shape", () => {
    const row = {
      id: "abc-123",
      status: "published",
      title: "Test Crossword",
      difficulty: "Medium",
      words: [{ word: "CAT", clue: "A pet" }],
      mainWord: "CAT",
      word: null,
      definition: null,
      maxAttempts: null,
      puzzle: null,
      solution: null,
      gridSize: null,
      scheduledDate: "2025-05-01T10:00:00.000Z",
      brandingId: "brand-1",
      userId: "user-1",
      orgId: "org-1",
      createdAt: "2025-04-01T10:00:00.000Z",
      updatedAt: "2025-04-02T10:00:00.000Z",
      creatorFirstName: "Alice",
      creatorLastName: "Smith",
      creatorEmail: "alice@example.com",
    }
    const result = mapGame(row)
    expect(result.id).toBe("abc-123")
    expect(result.title).toBe("Test Crossword")
    expect(result.main_word).toBe("CAT")
    expect(result.scheduled_date).toBe("2025-05-01T10:00:00.000Z")
    expect(result.branding).toBe("brand-1")
    expect(result.created_by).toBe("Alice Smith")
    expect(result.date_created).toBe("2025-04-01T10:00:00.000Z")
    expect(result.date_updated).toBe("2025-04-02T10:00:00.000Z")
  })

  it("falls back to email when no name is set", () => {
    const row = {
      id: "x", status: "draft", title: "T", difficulty: null, words: null,
      mainWord: null, word: null, definition: null, maxAttempts: null,
      puzzle: null, solution: null, gridSize: null, scheduledDate: null,
      brandingId: null, userId: "u", orgId: "o",
      createdAt: "2025-01-01", updatedAt: "2025-01-01",
      creatorFirstName: null, creatorLastName: null, creatorEmail: "bob@example.com",
    }
    expect(mapGame(row).created_by).toBe("bob@example.com")
  })

  it("sets created_by to null when no name or email", () => {
    const row = {
      id: "x", status: "draft", title: "T", difficulty: null, words: null,
      mainWord: null, word: null, definition: null, maxAttempts: null,
      puzzle: null, solution: null, gridSize: null, scheduledDate: null,
      brandingId: null, userId: "u", orgId: "o",
      createdAt: "2025-01-01", updatedAt: "2025-01-01",
      creatorFirstName: null, creatorLastName: null, creatorEmail: null,
    }
    expect(mapGame(row).created_by).toBeNull()
  })
})
