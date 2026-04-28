import { describe, it, expect } from "vitest"
import { BRANDING_SECTION_ORDER } from "@/lib/branding/section-order"

describe("BRANDING_SECTION_ORDER", () => {
  it("starts with theme so colors are chosen before logos", () => {
    expect(BRANDING_SECTION_ORDER[0]).toBe("theme")
  })

  it("places identity second so logo can be uploaded against the chosen surface", () => {
    expect(BRANDING_SECTION_ORDER[1]).toBe("identity")
  })

  it("ends with custom-css so the CSS escape hatch is the last thing offered", () => {
    expect(BRANDING_SECTION_ORDER[BRANDING_SECTION_ORDER.length - 1]).toBe("custom-css")
  })

  it("places game-colors immediately after components", () => {
    const idx = BRANDING_SECTION_ORDER.indexOf("game-colors")
    expect(idx).toBeGreaterThan(0)
    expect(BRANDING_SECTION_ORDER[idx - 1]).toBe("components")
    expect(BRANDING_SECTION_ORDER[idx + 1]).toBe("imagery")
  })

  it("does not include the deprecated 'advanced' section", () => {
    expect(BRANDING_SECTION_ORDER).not.toContain("advanced" as never)
  })

  it("contains all eight sections with no duplicates", () => {
    expect(BRANDING_SECTION_ORDER).toEqual([
      "theme",
      "identity",
      "typography",
      "spacing",
      "components",
      "game-colors",
      "imagery",
      "custom-css",
    ])
    expect(new Set(BRANDING_SECTION_ORDER).size).toBe(BRANDING_SECTION_ORDER.length)
  })
})
