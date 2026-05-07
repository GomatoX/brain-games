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
    id: "rust",
    name: "Rust",
    tokens: {
      primary: BRAND_DEFAULT_PRIMARY,
      surface: BRAND_DEFAULT_SURFACE,
      text: BRAND_DEFAULT_TEXT,
      overrides: {},
    },
  },
  {
    id: "forest",
    name: "Forest",
    tokens: { primary: "#15803d", surface: "#f6faf6", text: "#0d1f14", overrides: {} },
  },
  {
    id: "cobalt",
    name: "Cobalt",
    tokens: { primary: "#1d4ed8", surface: "#f6f8ff", text: "#0c1330", overrides: {} },
  },
  {
    id: "plum",
    name: "Plum",
    tokens: { primary: "#7e22ce", surface: "#faf6ff", text: "#1f0e2e", overrides: {} },
  },
  {
    id: "graphite",
    name: "Graphite",
    tokens: { primary: "#4d4d4d", surface: "#ffffff", text: "#0f172a", overrides: {} },
  },
  {
    id: "sun",
    name: "Sun",
    tokens: { primary: "#b45309", surface: "#fffaf0", text: "#1f1608", overrides: {} },
  },
  {
    id: "rose",
    name: "Rose",
    tokens: { primary: "#be185d", surface: "#fff5f8", text: "#2a0c18", overrides: {} },
  },
  {
    id: "ink",
    name: "Ink",
    tokens: { primary: "#0f172a", surface: "#f8fafc", text: "#0f172a", overrides: {} },
  },
  {
    id: "gold",
    name: "Gold",
    tokens: {
      primary: "#ffc107",
      surface: "#ffffff",
      text: "#02030d",
      overrides: {
        "primary-hover": "#ffc107",
        "primary-light": "#ffc107",
        "surface-elevated": "#f5f5f5",
        "text-muted": "#67686e",
        "border": "#e6e6e7",
        "correct": "#007a3c",
        "correct-light": "#e2f3ea",
        "present": "#b59f3b",
        "absent": "#787c7e",
        "cell-bg": "#ffffff",
        "cell-blocked": "#02030d",
        "selection": "#a2aaff",
        "selection-ring": "#a2aaff",
        "highlight": "#ffc107",
        "grid-border": "#02030d",
        "main-word-marker": "#fff2ca",
        "sidebar-active": "#a2aaff",
        "sidebar-active-bg": "#e6e8ff",
      },
    },
  },
]
