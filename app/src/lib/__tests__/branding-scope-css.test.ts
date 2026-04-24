import { describe, it, expect } from "vitest"
import { scopeCss } from "../branding/scope-css"

const scope = `[data-org-id="acme"]`

describe("scopeCss", () => {
  it("prefixes a single class selector", () => {
    expect(scopeCss(".foo { color: red; }", "acme").trim())
      .toBe(`${scope} .foo { color: red; }`)
  })

  it("prefixes each selector in a comma-separated list", () => {
    const out = scopeCss(".a, .b { color: red }", "acme")
    expect(out).toContain(`${scope} .a`)
    expect(out).toContain(`${scope} .b`)
  })

  it("scopes inside @media blocks at the inner-rule level", () => {
    const out = scopeCss("@media (min-width: 600px) { .x { color: red } }", "acme")
    expect(out).toContain("@media (min-width: 600px)")
    expect(out).toContain(`${scope} .x`)
  })

  it("preserves comments", () => {
    const out = scopeCss("/* hello */ .x { color: red }", "acme")
    expect(out).toContain("/* hello */")
    expect(out).toContain(`${scope} .x`)
  })

  it("returns an empty string for empty input", () => {
    expect(scopeCss("", "acme")).toBe("")
  })

  it("escapes the org-id value (no breaking the scope on quotes)", () => {
    const out = scopeCss(".x { color: red }", `weird"id`)
    expect(out).not.toContain(`weird"id`)
    expect(out).toContain(`weird&quot;id`)
  })
})
