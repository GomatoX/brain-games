import type { BrandingTokens } from "./tokens"
import {
  BRAND_DEFAULT_PRIMARY,
  BRAND_DEFAULT_SURFACE,
  BRAND_DEFAULT_TEXT,
} from "./defaults"

export interface BrandingPreset {
  id: string
  name: string
  tokens: BrandingTokens
}

export const PRESETS: BrandingPreset[] = [
  {
    id: "coral",
    name: "Coral",
    tokens: {
      primary: BRAND_DEFAULT_PRIMARY,
      surface: BRAND_DEFAULT_SURFACE,
      text: BRAND_DEFAULT_TEXT,
      overrides: {},
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    tokens: { primary: "#0ea5e9", surface: "#f8fafc", text: "#0c4a6e", overrides: {} },
  },
  {
    id: "forest",
    name: "Forest",
    tokens: { primary: "#16a34a", surface: "#ffffff", text: "#14532d", overrides: {} },
  },
  {
    id: "mono",
    name: "Mono",
    tokens: { primary: "#0f172a", surface: "#ffffff", text: "#0f172a", overrides: {} },
  },
  {
    id: "sunset",
    name: "Sunset",
    tokens: { primary: "#f97316", surface: "#fffbeb", text: "#7c2d12", overrides: {} },
  },
]
