import { describe, it, expect } from "vitest"
import { BRANDING_SECTION_ORDER } from "@/lib/branding/section-order"

describe("BRANDING_SECTION_ORDER", () => {
  it("starts with theme so colors are chosen before logos", () => {
    expect(BRANDING_SECTION_ORDER[0]).toBe("theme")
  })

  it("places identity second so logo can be uploaded against the chosen surface", () => {
    expect(BRANDING_SECTION_ORDER[1]).toBe("identity")
  })

  it("ends with advanced so power-user options are out of the way", () => {
    expect(BRANDING_SECTION_ORDER[BRANDING_SECTION_ORDER.length - 1]).toBe("advanced")
  })

  it("contains all eight sections with no duplicates", () => {
    expect(BRANDING_SECTION_ORDER).toEqual([
      "theme",
      "identity",
      "typography",
      "spacing",
      "components",
      "imagery",
      "custom-css",
      "advanced",
    ])
    expect(new Set(BRANDING_SECTION_ORDER).size).toBe(BRANDING_SECTION_ORDER.length)
  })
})
