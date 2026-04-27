export type BrandingSectionId =
  | "theme"
  | "identity"
  | "typography"
  | "spacing"
  | "components"
  | "imagery"
  | "custom-css"
  | "advanced"

export const BRANDING_SECTION_ORDER: readonly BrandingSectionId[] = [
  "theme",
  "identity",
  "typography",
  "spacing",
  "components",
  "imagery",
  "custom-css",
  "advanced",
] as const
