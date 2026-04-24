import { describe, it, expect } from "vitest"
import { deriveTokens } from "../branding/derive"

const SEEDS = { primary: "#c25e40", surface: "#ffffff", text: "#0f172a", overrides: {} }

describe("deriveTokens", () => {
  it("returns a flat record with all 3 seeds preserved verbatim", () => {
    const out = deriveTokens(SEEDS)
    expect(out["primary"]).toBe("#c25e40")
    expect(out["surface"]).toBe("#ffffff")
    expect(out["text"]).toBe("#0f172a")
  })

  it("derives primary-hover darker than primary (different from seed)", () => {
    const out = deriveTokens(SEEDS)
    expect(out["primary-hover"]).not.toBe(out["primary"])
    expect(out["primary-hover"]).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it("derives primary-foreground that contrasts well against primary", () => {
    const dark = deriveTokens({ ...SEEDS, primary: "#0f172a" })
    expect(dark["primary-foreground"].toLowerCase()).toBe("#ffffff")
    const light = deriveTokens({ ...SEEDS, primary: "#fef3c7" })
    expect(light["primary-foreground"].toLowerCase()).not.toBe("#ffffff")
  })

  it("emits border at low alpha derived from text", () => {
    const out = deriveTokens(SEEDS)
    expect(out["border"]).toMatch(/rgba?\(/)
  })

  it("emits text-muted derived from text at reduced alpha", () => {
    const out = deriveTokens(SEEDS)
    expect(out["text-muted"]).toMatch(/rgba?\(/)
  })

  it("emits all expected token names", () => {
    const out = deriveTokens(SEEDS)
    const expected = [
      "primary", "primary-hover", "primary-light", "primary-foreground",
      "surface", "surface-elevated", "surface-muted",
      "text", "text-muted", "border",
      "correct", "correct-light", "present", "absent",
      "selection", "selection-ring", "highlight",
      "cell-bg", "cell-blocked", "grid-border", "main-word-marker",
      "sidebar-active", "sidebar-active-bg",
    ]
    for (const k of expected) {
      expect(out[k], `missing token ${k}`).toBeDefined()
    }
  })

  it("overrides win over derived values", () => {
    const out = deriveTokens({ ...SEEDS, overrides: { "primary-hover": "#deadbe" } })
    expect(out["primary-hover"]).toBe("#deadbe")
  })

  it("overrides cannot replace seeds (seeds are not in overrides scope)", () => {
    const out = deriveTokens({ ...SEEDS, overrides: { primary: "#000000" } })
    expect(out["primary"]).toBe("#c25e40")
  })
})
