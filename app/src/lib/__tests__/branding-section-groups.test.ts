import { describe, it, expect } from "vitest"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"
import {
  THEME_CORE_TOKENS,
  THEME_DETAIL_TOKENS,
  GAME_COLOR_GROUPS,
  hasThemeDetailOverrides,
} from "@/lib/branding/section-groups"

describe("branding section groups", () => {
  it("Theme core has exactly the three brand seeds", () => {
    expect(THEME_CORE_TOKENS).toEqual(["primary", "surface", "text"])
  })

  it("Theme details lists the six derivatives in display order", () => {
    expect(THEME_DETAIL_TOKENS).toEqual([
      "primary-hover",
      "primary-light",
      "primary-foreground",
      "text-muted",
      "surface-elevated",
      "surface-muted",
    ])
  })

  it("Game colors expose sub-groups in display order", () => {
    expect(GAME_COLOR_GROUPS.map((g) => g.id)).toEqual([
      "state-feedback",
      "grid",
      "sidebar",
    ])
  })

  it("Game colors sub-groups carry the expected token counts", () => {
    // Catches a token silently moving between sub-groups — the partition
    // coverage test below cannot detect that on its own.
    expect(GAME_COLOR_GROUPS.map((g) => g.tokenIds.length)).toEqual([8, 4, 2])
  })

  it("every TOKEN_REGISTRY id is accounted for in exactly one group", () => {
    const allGroupIds = [
      ...THEME_CORE_TOKENS,
      ...THEME_DETAIL_TOKENS,
      ...GAME_COLOR_GROUPS.flatMap((g) => g.tokenIds),
    ]
    const registryIds = TOKEN_REGISTRY.map((t) => t.id).sort()
    expect([...allGroupIds].sort()).toEqual(registryIds)
    expect(new Set(allGroupIds).size).toBe(allGroupIds.length)
  })

  it("hasThemeDetailOverrides returns true when any detail token is overridden", () => {
    expect(hasThemeDetailOverrides({})).toBe(false)
    expect(hasThemeDetailOverrides({ "text-muted": "#abc" })).toBe(true)
    expect(hasThemeDetailOverrides({ "primary-hover": "#000" })).toBe(true)
  })

  it("hasThemeDetailOverrides ignores non-detail overrides", () => {
    // primary itself is not a "detail" token — overriding it shouldn't open the panel
    expect(hasThemeDetailOverrides({ correct: "#0f0" })).toBe(false)
  })
})
