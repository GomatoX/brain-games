import type {
  BrandingTokens,
  BrandingTypography,
  BrandingSpacing,
  BrandingComponents,
} from "./tokens"

// Canonical coral. Keep this as a literal — it's the brand identity. Hosted
// platforms can override the live primary at runtime via PLATFORM_ACCENT (read
// in resolve.ts), but the design-time / fallback constant stays fixed so that
// builds and tests are deterministic.
export const BRAND_DEFAULT_PRIMARY = "#c25e40"
export const BRAND_DEFAULT_SURFACE = "#ffffff"
export const BRAND_DEFAULT_TEXT = "#0f172a"

export const PLATFORM_DEFAULT_TOKENS: BrandingTokens = Object.freeze({
  primary: BRAND_DEFAULT_PRIMARY,
  surface: BRAND_DEFAULT_SURFACE,
  text: BRAND_DEFAULT_TEXT,
  overrides: Object.freeze({}) as Record<string, string>,
}) as BrandingTokens

export const PLATFORM_DEFAULT_TYPOGRAPHY: BrandingTypography = Object.freeze({
  fontSans: null,
  fontSerif: null,
  scale: "default",
}) as BrandingTypography

export const PLATFORM_DEFAULT_SPACING: BrandingSpacing = Object.freeze({
  density: "cozy",
  radius: 8,
}) as BrandingSpacing

export const PLATFORM_DEFAULT_COMPONENTS: BrandingComponents = Object.freeze({
  button: Object.freeze({ variant: "solid", shadow: "subtle" }),
  input: Object.freeze({ variant: "outlined" }),
  card: Object.freeze({ elevation: "subtle" }),
}) as BrandingComponents
