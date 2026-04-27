import { describe, it, expect, vi } from "vitest"

vi.mock("@/db", () => ({ db: {} }))
vi.mock("@/db/schema", () => ({
  crosswords: { brandingId: "branding_id", orgId: "org_id" },
  wordgames: { brandingId: "branding_id", orgId: "org_id" },
  sudoku: { brandingId: "branding_id", orgId: "org_id" },
  wordsearches: { brandingId: "branding_id", orgId: "org_id" },
}))

import { mergeUsageCounts, formatUsageLabel } from "@/lib/branding/usage"

describe("mergeUsageCounts", () => {
  it("returns an empty map when no rows reference any brand", () => {
    const result = mergeUsageCounts([[], [], [], []])
    expect(result.size).toBe(0)
  })

  it("sums counts across the four game tables", () => {
    const result = mergeUsageCounts([
      [{ brandingId: "b1", count: 2 }],
      [{ brandingId: "b1", count: 3 }, { brandingId: "b2", count: 1 }],
      [{ brandingId: "b2", count: 4 }],
      [{ brandingId: "b1", count: 1 }],
    ])
    expect(result.get("b1")).toBe(6)
    expect(result.get("b2")).toBe(5)
  })

  it("ignores rows whose brandingId is null", () => {
    const result = mergeUsageCounts([
      [{ brandingId: null, count: 9 }, { brandingId: "b1", count: 1 }],
      [],
      [],
      [],
    ])
    expect(result.get("b1")).toBe(1)
    expect(result.size).toBe(1)
  })
})

describe("formatUsageLabel", () => {
  it("returns 'Not used yet' for zero", () => {
    expect(formatUsageLabel(0)).toBe("Not used yet")
  })

  it("singular for one", () => {
    expect(formatUsageLabel(1)).toBe("Used by 1 game")
  })

  it("plural for many", () => {
    expect(formatUsageLabel(7)).toBe("Used by 7 games")
  })
})
