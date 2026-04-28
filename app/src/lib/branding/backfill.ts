import { TOKEN_REGISTRY } from "./token-registry"

// Derived once at module load. Equivalent to the pre-2026-04-27 hardcoded
// OVERRIDE_FIELD_MAP, but driven by the token registry so adding/removing
// a legacy column is a single-place edit on TokenDef.
export const LEGACY_COLUMN_TO_TOKEN_ID: Record<string, string> =
  Object.fromEntries(
    TOKEN_REGISTRY
      .filter((t): t is typeof t & { legacyKey: string } => Boolean(t.legacyKey))
      .map((t) => [t.legacyKey, t.id]),
  )

export interface OldBrandingRow {
  id: string
  accent_color: string | null
  accent_hover_color: string | null
  accent_light_color: string | null
  selection_color: string | null
  selection_ring_color: string | null
  highlight_color: string | null
  correct_color: string | null
  correct_light_color: string | null
  present_color: string | null
  absent_color: string | null
  bg_primary_color: string | null
  bg_secondary_color: string | null
  text_primary_color: string | null
  text_secondary_color: string | null
  border_color: string | null
  cell_bg_color: string | null
  cell_blocked_color: string | null
  sidebar_active_color: string | null
  sidebar_active_bg_color: string | null
  grid_border_color: string | null
  main_word_marker_color: string | null
  font_sans: string | null
  font_serif: string | null
  border_radius: string | null
}

export interface BackfillDefaults {
  primary: string
  surface: string
  text: string
}

export interface BackfilledRow {
  tokens: { primary: string; surface: string; text: string; overrides: Record<string, string> }
  typography: { fontSans: string | null; fontSerif: string | null; scale: "default" }
  spacing: { density: "cozy"; radius: number }
  components: { button: { variant: "solid"; shadow: "subtle" }; input: { variant: "outlined" }; card: { elevation: "subtle" } }
}

export function backfillRow(row: OldBrandingRow, defaults: BackfillDefaults): BackfilledRow {
  const overrides: Record<string, string> = {}
  for (const [oldKey, newKey] of Object.entries(LEGACY_COLUMN_TO_TOKEN_ID)) {
    const v = row[oldKey as keyof OldBrandingRow]
    if (v) overrides[newKey] = v as string
  }

  const radius = row.border_radius
    ? Number.parseInt(row.border_radius.replace(/[^\d]/g, ""), 10) || 8
    : 8

  return {
    tokens: {
      primary: row.accent_color || defaults.primary,
      surface: row.bg_primary_color || defaults.surface,
      text: row.text_primary_color || defaults.text,
      overrides,
    },
    typography: { fontSans: row.font_sans, fontSerif: row.font_serif, scale: "default" },
    spacing: { density: "cozy", radius },
    components: {
      button: { variant: "solid", shadow: "subtle" },
      input: { variant: "outlined" },
      card: { elevation: "subtle" },
    },
  }
}
