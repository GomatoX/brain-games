export const MAX_CSS_BYTES = 16 * 1024

export function sanitizeCss(input: string): { css: string; bytes: number } {
  if (input.length > MAX_CSS_BYTES) {
    throw new Error(`Custom CSS too large (max ${MAX_CSS_BYTES} bytes)`)
  }
  let css = input
  css = css.replace(/@import\s+[^;]+;?/gi, "")
  css = css.replace(/expression\s*\([^)]*\)/gi, "")
  css = css.replace(/javascript\s*:[^)\s;]*/gi, "")
  css = css.replace(/behavior\s*:[^;]+;?/gi, "")
  css = css.replace(/[<>]/g, "")
  return { css, bytes: css.length }
}
