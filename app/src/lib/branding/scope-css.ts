const escapeOrgId = (id: string): string =>
  id
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

const prefixSelectorList = (selectors: string, scope: string): string =>
  selectors
    .split(",")
    .map((s) => `${scope} ${s.trim()}`)
    .join(", ")

export function scopeCss(css: string, orgId: string): string {
  if (!css) return ""
  const scope = `[data-org-id="${escapeOrgId(orgId)}"]`

  let out = ""
  let i = 0
  let depth = 0
  let buf = ""

  while (i < css.length) {
    const ch = css[i]

    // pass through /* ... */ comments untouched
    if (ch === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2)
      const slice = end >= 0 ? css.slice(i, end + 2) : css.slice(i)
      out += buf + slice
      buf = ""
      i = end >= 0 ? end + 2 : css.length
      continue
    }

    if (ch === "{") {
      if (depth === 0) {
        const sel = buf.trim()
        if (sel.startsWith("@media") || sel.startsWith("@supports") || sel.startsWith("@layer")) {
          out += sel + " {"
        } else if (sel.startsWith("@")) {
          // pass-through: @keyframes / @font-face / @page / @property / @counter-style / etc.
          out += sel + " {"
        } else if (sel) {
          out += prefixSelectorList(sel, scope) + " {"
        } else {
          out += "{"
        }
      } else {
        out += buf + "{"
      }
      buf = ""
      depth++
      i++
      continue
    }

    if (ch === "}") {
      out += buf + "}"
      buf = ""
      depth--
      i++
      continue
    }

    // Inside an at-rule body (depth >= 1), handle nested rules: when we see a selector inside @media,
    // it's depth=1 and we're collecting a new selector. The next "{" with depth=1 will fall into
    // the depth>0 branch above, which doesn't scope. We need to scope inner rules inside at-rules.
    // Simpler: track if we're at "rule level" inside an at-rule.
    buf += ch
    i++
  }

  // For the at-rule case: re-process inner rules. The above only scopes top-level rules.
  // Handle @media etc. by recursing on their bodies.
  return scopeAtRules(out, scope)
}

function scopeAtRules(css: string, scope: string): string {
  // Find @media/@supports/@layer blocks and scope their inner rules.
  return css.replace(
    /(@(?:media|supports|layer)[^{]*\{)([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g,
    (_full, head, body) => {
      const inner = body.replace(/([^{}]+)\{/g, (_m: string, sel: string) => {
        const trimmed = sel.trim()
        if (!trimmed || trimmed.startsWith("@")) return `${trimmed} {`
        return `${prefixSelectorList(trimmed, scope)} {`
      })
      return `${head}${inner}}`
    },
  )
}
