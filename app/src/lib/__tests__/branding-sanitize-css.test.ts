import { describe, it, expect } from "vitest"
import { sanitizeCss, MAX_CSS_BYTES } from "../branding/sanitize-css"

describe("sanitizeCss", () => {
  it("returns input unchanged when safe", () => {
    expect(sanitizeCss(".foo { color: red; }").css).toBe(".foo { color: red; }")
  })

  it("strips @import lines", () => {
    const out = sanitizeCss(`@import url('evil.css');\n.foo { color: red }`)
    expect(out.css).not.toContain("@import")
    expect(out.css).toContain(".foo")
  })

  it("strips expression(...) tokens", () => {
    const out = sanitizeCss(".foo { width: expression(alert(1)); }")
    expect(out.css).not.toContain("expression(")
  })

  it("strips javascript: URLs", () => {
    const out = sanitizeCss(".foo { background: url(javascript:alert(1)); }")
    expect(out.css).not.toContain("javascript:")
  })

  it("strips behavior: declarations", () => {
    const out = sanitizeCss(".foo { behavior: url(evil.htc); }")
    expect(out.css).not.toContain("behavior:")
  })

  it("strips embedded HTML angle brackets", () => {
    const out = sanitizeCss(".foo { content: '<script>'; }")
    expect(out.css).not.toContain("<")
  })

  it("rejects CSS exceeding MAX_CSS_BYTES", () => {
    const big = "a".repeat(MAX_CSS_BYTES + 1)
    expect(() => sanitizeCss(big)).toThrow(/too large/i)
  })

  it("returns the resulting byte length", () => {
    const out = sanitizeCss(".foo { color: red }")
    expect(out.bytes).toBe(out.css.length)
  })

  it("strips expression() even when split by CSS comments (postcss tokenization)", () => {
    const out = sanitizeCss(".x { width: expr/**/ession(alert(1)) }")
    expect(out.css).not.toMatch(/expression/i)
  })

  it("strips javascript: even when obscured with CSS unicode escapes", () => {
    const out = sanitizeCss(".x { background: url(\\6A avascript:alert(1)) }")
    expect(out.css).not.toMatch(/javascript\s*:/i)
  })

  it("does not corrupt adjacent rules when removing behavior:", () => {
    const out = sanitizeCss(".a { behavior: url(x.htc); color: red } .b { color: blue }")
    expect(out.css).toContain(".b")
    expect(out.css).toContain("color: blue")
    expect(out.css).not.toContain("behavior")
  })

  it("uses UTF-8 byte count, not character length, for the size limit", () => {
    expect(() => sanitizeCss("a".repeat(16385))).toThrow(/too large/i)
    const fourByteEmoji = "\u{1F600}"
    expect(() => sanitizeCss(fourByteEmoji.repeat(4097))).toThrow(/too large/i)
  })
})
