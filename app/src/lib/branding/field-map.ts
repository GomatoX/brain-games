import { TOKEN_REGISTRY } from "./token-registry"

// Token name → list of CSS custom property names it sets.
// Multiple CSS vars per token allow legacy game CSS to still work
// (e.g. selection sets both --cell-selected-bg and --cell-selected).
// Derived from TOKEN_REGISTRY (the source of truth) for back-compat.
export const FIELD_MAP: Record<string, string[]> = Object.fromEntries(
  TOKEN_REGISTRY.map((t) => [t.id, t.cssVars]),
)

export const TYPOGRAPHY_VARS = {
  fontSans: "--font-sans",
  fontSerif: "--font-serif",
}

export const SCALE_VARS: Record<"compact" | "default" | "relaxed", Record<string, string>> = {
  compact:  { "--text-sm": "0.8125rem", "--text-base": "0.9375rem", "--text-lg": "1.0625rem", "--text-xl": "1.25rem" },
  default:  { "--text-sm": "0.875rem",  "--text-base": "1rem",      "--text-lg": "1.125rem",  "--text-xl": "1.375rem" },
  relaxed:  { "--text-sm": "0.9375rem", "--text-base": "1.0625rem", "--text-lg": "1.1875rem", "--text-xl": "1.5rem"  },
}

export const DENSITY_VARS: Record<"compact" | "cozy" | "comfortable", Record<string, string>> = {
  compact:     { "--space-1": "0.125rem", "--space-2": "0.25rem", "--space-3": "0.5rem",  "--space-4": "0.75rem", "--space-6": "1rem" },
  cozy:        { "--space-1": "0.25rem",  "--space-2": "0.5rem",  "--space-3": "0.75rem", "--space-4": "1rem",    "--space-6": "1.5rem" },
  comfortable: { "--space-1": "0.375rem", "--space-2": "0.75rem", "--space-3": "1rem",    "--space-4": "1.5rem",  "--space-6": "2rem" },
}

export function radiusVars(md: number): Record<string, string> {
  return {
    "--radius-sm":   `${(md * 0.5).toFixed(2)}px`,
    "--radius-md":   `${md.toFixed(2)}px`,
    "--radius-lg":   `${(md * 1.5).toFixed(2)}px`,
    "--radius-xl":   `${(md * 2).toFixed(2)}px`,
    "--radius-pill": "9999px",
  }
}
