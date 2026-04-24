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

export interface ResolvedBrand {
  tokens: Record<string, string>
  typography: BrandingTypography
  spacing: BrandingSpacing
  components: BrandingComponents
  logoPath: string | null
  logoDarkPath: string | null
  faviconPath: string | null
  backgroundPath: string | null
  ogImagePath: string | null
  customCssGames: string | null
}
