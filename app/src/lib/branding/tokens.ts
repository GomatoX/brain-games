export interface BrandingTokens {
  primary: string
  surface: string
  text: string
  overrides: Record<string, string>
}

export interface BrandingTypography {
  fontSans: string | null
  fontSerif: string | null
  scale: "compact" | "default" | "relaxed"
}

export interface BrandingSpacing {
  density: "compact" | "cozy" | "comfortable"
  radius: number
}

export interface BrandingComponents {
  button: { variant: "solid" | "outline" | "ghost-fill"; shadow: "none" | "subtle" | "pronounced" }
  input: { variant: "outlined" | "filled" | "underlined" }
  card: { elevation: "flat" | "subtle" | "lifted" }
}
