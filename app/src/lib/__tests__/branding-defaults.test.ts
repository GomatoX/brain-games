import { describe, it, expect } from "vitest"
import {
  PLATFORM_DEFAULT_TOKENS,
  PLATFORM_DEFAULT_TYPOGRAPHY,
  PLATFORM_DEFAULT_SPACING,
  PLATFORM_DEFAULT_COMPONENTS,
  BRAND_DEFAULT_PRIMARY,
} from "../branding/defaults"

describe("branding defaults", () => {
  it("BRAND_DEFAULT_PRIMARY is the canonical coral hex", () => {
    expect(BRAND_DEFAULT_PRIMARY).toBe("#c25e40")
  })

  it("PLATFORM_DEFAULT_TOKENS uses the brand default and white surface / slate text", () => {
    expect(PLATFORM_DEFAULT_TOKENS).toEqual({
      primary: "#c25e40",
      surface: "#ffffff",
      text: "#0f172a",
      overrides: {},
    })
  })

  it("PLATFORM_DEFAULT_TYPOGRAPHY is the platform-neutral typography stack", () => {
    expect(PLATFORM_DEFAULT_TYPOGRAPHY).toEqual({
      fontSans: null,
      fontSerif: null,
      scale: "default",
    })
  })

  it("PLATFORM_DEFAULT_SPACING is cozy / 8 px radius", () => {
    expect(PLATFORM_DEFAULT_SPACING).toEqual({ density: "cozy", radius: 8 })
  })

  it("PLATFORM_DEFAULT_COMPONENTS is the conservative solid/outlined/subtle triple", () => {
    expect(PLATFORM_DEFAULT_COMPONENTS).toEqual({
      button: { variant: "solid", shadow: "subtle" },
      input: { variant: "outlined" },
      card: { elevation: "subtle" },
    })
  })

  it("PLATFORM_DEFAULT_TOKENS.overrides is a fresh object on each access pattern (not shared mutable state)", () => {
    expect(Object.isFrozen(PLATFORM_DEFAULT_TOKENS.overrides)).toBe(true)
  })
})
