import "server-only"
import DOMPurify from "isomorphic-dompurify"

const SVG_CONFIG = {
  USE_PROFILES: { svg: true, svgFilters: true },
  KEEP_CONTENT: false,
}

export function sanitizeSvg(input: string): string {
  return DOMPurify.sanitize(input, SVG_CONFIG) as unknown as string
}
