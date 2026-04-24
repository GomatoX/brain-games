import { describe, it, expect } from "vitest"
import { sanitizeSvg } from "../branding/sanitize-svg"

const wrap = (inner: string) =>
  `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg">${inner}</svg>`

describe("sanitizeSvg", () => {
  it("preserves benign content", () => {
    const ok = wrap(`<circle cx="10" cy="10" r="5" fill="red" />`)
    expect(sanitizeSvg(ok)).toContain("<circle")
  })

  it("strips <script> tags", () => {
    const dirty = wrap(`<script>alert(1)</script><circle/>`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain("<script")
    expect(clean).toContain("<circle")
  })

  it("strips on* event handler attributes", () => {
    const dirty = wrap(`<circle onload="alert(1)" onclick="alert(2)" cx="10" />`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toMatch(/onload/i)
    expect(clean).not.toMatch(/onclick/i)
    expect(clean).toContain("cx")
  })

  it("strips javascript: URLs in href / xlink:href", () => {
    const dirty = wrap(`<a href="javascript:alert(1)"><circle /></a>`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toMatch(/javascript:/i)
  })

  it("strips <foreignObject>", () => {
    const dirty = wrap(`<foreignObject><body>x</body></foreignObject>`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain("<foreignObject")
  })

  it("handles uppercase tag names", () => {
    const dirty = wrap(`<SCRIPT>alert(1)</SCRIPT>`)
    expect(sanitizeSvg(dirty)).not.toMatch(/<script/i)
  })

  // Bypass-class tests that motivated the parser switch:

  it("strips namespaced event attributes (xlink:onload, etc.)", () => {
    const dirty = wrap(`<animate xlink:onload="alert(1)" attributeName="x" />`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toMatch(/onload/i)
  })

  it("strips event handlers inside CDATA", () => {
    const dirty = wrap(`<script><![CDATA[ alert(1) ]]></script><circle/>`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toContain("alert")
    expect(clean).toContain("<circle")
  })

  it("strips data:text/html URLs in href attributes", () => {
    const dirty = wrap(`<a href="data:text/html,<script>alert(1)</script>"><circle/></a>`)
    const clean = sanitizeSvg(dirty)
    expect(clean).not.toMatch(/data:text\/html/i)
    // The <a> may or may not survive depending on DOMPurify config, but the dangerous URL must be gone.
  })
})
