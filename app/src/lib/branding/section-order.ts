export type BrandingSectionId =
  | "theme"
  | "identity"
  | "typography"
  | "spacing"
  | "components"
  | "game-colors"
  | "imagery"
  | "custom-css"

export const BRANDING_SECTION_ORDER: readonly BrandingSectionId[] = [
  "theme",
  "identity",
  "typography",
  "spacing",
  "components",
  "game-colors",
  "imagery",
  "custom-css",
] as const
