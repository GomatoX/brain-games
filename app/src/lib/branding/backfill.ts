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

const OVERRIDE_FIELD_MAP: Record<string, string> = {
  accent_hover_color: "primary-hover",
  accent_light_color: "primary-light",
  selection_color: "selection",
  selection_ring_color: "selection-ring",
  highlight_color: "highlight",
  correct_color: "correct",
  correct_light_color: "correct-light",
  present_color: "present",
  absent_color: "absent",
  bg_secondary_color: "surface-elevated",
  text_secondary_color: "text-muted",
  border_color: "border",
  cell_bg_color: "cell-bg",
  cell_blocked_color: "cell-blocked",
  sidebar_active_color: "sidebar-active",
  sidebar_active_bg_color: "sidebar-active-bg",
  grid_border_color: "grid-border",
  main_word_marker_color: "main-word-marker",
}

export function backfillRow(row: OldBrandingRow, defaults: BackfillDefaults): BackfilledRow {
  const overrides: Record<string, string> = {}
  for (const [oldKey, newKey] of Object.entries(OVERRIDE_FIELD_MAP)) {
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
