import "server-only"
import postcss, { type AtRule, type Declaration } from "postcss"

export const MAX_CSS_BYTES = 16 * 1024

const DISALLOWED_AT_RULES = new Set(["import", "charset"])
const BAD_VALUE_PATTERNS = [
  /expression\s*\(/i,
  /javascript\s*:/i,
  /url\s*\(\s*['"]?\s*javascript:/i,
  /url\s*\(\s*['"]?\s*data:text\/html/i,
  /url\s*\([^)]*\\[0-9a-f]/i,
]
const BAD_PROPERTY_NAMES = new Set([
  "behavior",
  "-moz-binding",
  "-ms-behavior",
])

export function sanitizeCss(input: string): { css: string; bytes: number } {
  const inputBytes = Buffer.byteLength(input, "utf8")
  if (inputBytes > MAX_CSS_BYTES) {
    throw new Error(`Custom CSS too large (max ${MAX_CSS_BYTES} bytes)`)
  }

  let root
  try {
    root = postcss.parse(input)
  } catch {
    return { css: "", bytes: 0 }
  }

  root.walkAtRules((rule: AtRule) => {
    if (DISALLOWED_AT_RULES.has(rule.name.toLowerCase())) {
      rule.remove()
    }
  })

  root.walkDecls((decl: Declaration) => {
    const propLower = decl.prop.toLowerCase()
    if (BAD_PROPERTY_NAMES.has(propLower)) {
      decl.remove()
      return
    }
    if (BAD_VALUE_PATTERNS.some((re) => re.test(decl.value))) {
      decl.remove()
    }
  })

  const css = root.toString().replace(/[<>]/g, "")
  return { css, bytes: Buffer.byteLength(css, "utf8") }
}
