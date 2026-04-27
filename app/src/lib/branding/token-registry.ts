// Single source of truth for branded design tokens. When adding or changing
// entries here, also update the snapshot in
// `app/src/lib/__tests__/branding-field-map-compat.test.ts` so the resolve
// pipeline regression guard reflects the new shape.

export type TokenGroup = "color" | "surface" | "state" | "feedback" | "structural"

export type TokenDef = {
  id: string
  cssVars: string[]
  label: string
  description: string
  group: TokenGroup
  /** Old flat-column name on the pre-orgs branding table.
   *  Set only on tokens that map directly from a legacy column.
   *  Seed tokens (primary/surface/text) are not listed here — they're
   *  handled separately in backfill because their old column names
   *  (accent_color / bg_primary_color / text_primary_color) are seeds,
   *  not overrides. */
  legacyKey?: string
}

export const TOKEN_REGISTRY: TokenDef[] = [
  { id: "primary",            cssVars: ["--primary", "--accent"],
    label: "Primary",         description: "Main brand colour. Drives buttons, accents, and the selection ring.",
    group: "color" },
  { id: "primary-hover",      cssVars: ["--primary-hover", "--accent-hover"],
    label: "Primary (hover)", description: "Darker shade of the brand colour used on hover.",
    group: "color",           legacyKey: "accent_hover_color" },
  { id: "primary-light",      cssVars: ["--primary-light", "--accent-light"],
    label: "Primary (light)", description: "Pale tint of the brand colour, used as a soft fill.",
    group: "color",           legacyKey: "accent_light_color" },
  { id: "primary-foreground", cssVars: ["--primary-foreground"],
    label: "Primary text",    description: "Text colour shown on top of the primary brand colour.",
    group: "color" },
  { id: "surface",            cssVars: ["--surface", "--bg-primary"],
    label: "Surface",         description: "Page background and card surface.",
    group: "surface" },
  { id: "surface-elevated",   cssVars: ["--surface-elevated", "--bg-secondary"],
    label: "Elevated surface",description: "Slightly raised areas — e.g. clue list cards, hover states.",
    group: "surface",         legacyKey: "bg_secondary_color" },
  { id: "surface-muted",      cssVars: ["--surface-muted"],
    label: "Muted surface",   description: "Subtle background for de-emphasised content.",
    group: "surface" },
  { id: "text",               cssVars: ["--text", "--text-primary"],
    label: "Text",            description: "Default body text colour.",
    group: "color" },
  { id: "text-muted",         cssVars: ["--text-muted", "--text-secondary"],
    label: "Muted text",      description: "Lower-emphasis text — labels, secondary captions.",
    group: "color",           legacyKey: "text_secondary_color" },
  { id: "border",             cssVars: ["--border", "--border-color"],
    label: "Border",          description: "Hairline borders around cards, inputs, dividers.",
    group: "structural",      legacyKey: "border_color" },
  { id: "correct",            cssVars: ["--correct"],
    label: "Correct",         description: "Success colour for correctly solved cells and answers.",
    group: "feedback",        legacyKey: "correct_color" },
  { id: "correct-light",      cssVars: ["--correct-light"],
    label: "Correct (light)", description: "Pale success fill — e.g. correctly placed letter background in word game.",
    group: "feedback",        legacyKey: "correct_light_color" },
  { id: "present",            cssVars: ["--present"],
    label: "Present",         description: "Word-game state: letter is in the word but in the wrong position.",
    group: "feedback",        legacyKey: "present_color" },
  { id: "absent",             cssVars: ["--absent"],
    label: "Absent",          description: "Word-game state: letter is not in the word.",
    group: "feedback",        legacyKey: "absent_color" },
  { id: "selection",          cssVars: ["--selection", "--cell-selected", "--cell-selected-bg"],
    label: "Selected cell",   description: "Background of the currently selected cell or drag path.",
    group: "state",           legacyKey: "selection_color" },
  { id: "selection-ring",     cssVars: ["--selection-ring", "--cell-selected-ring"],
    label: "Selection ring",  description: "Border around the currently selected cell or active row.",
    group: "state",           legacyKey: "selection_ring_color" },
  { id: "highlight",          cssVars: ["--highlight", "--cell-highlighted", "--cell-related"],
    label: "Highlighted clue",description: "Active clue banner background, and cells that share a word with the selected cell.",
    group: "state",           legacyKey: "highlight_color" },
  { id: "cell-bg",            cssVars: ["--cell-bg"],
    label: "Cell background", description: "Default fill colour of an empty grid cell.",
    group: "structural",      legacyKey: "cell_bg_color" },
  { id: "cell-blocked",       cssVars: ["--cell-blocked"],
    label: "Blocked cells",   description: "Crossword squares with no letter — the solid black blocks.",
    group: "structural",      legacyKey: "cell_blocked_color" },
  { id: "grid-border",        cssVars: ["--grid-border"],
    label: "Grid border",     description: "Thin line drawn around each cell in the grid.",
    group: "structural",      legacyKey: "grid_border_color" },
  { id: "main-word-marker",   cssVars: ["--main-word-marker"],
    label: "Main word marker",description: "Highlight on the row/column that hides the daily phrase in crossword.",
    group: "state",           legacyKey: "main_word_marker_color" },
  { id: "sidebar-active",     cssVars: ["--sidebar-active"],
    label: "Sidebar active text", description: "Text colour for the active item in the dashboard sidebar.",
    group: "color",           legacyKey: "sidebar_active_color" },
  { id: "sidebar-active-bg",  cssVars: ["--sidebar-active-bg"],
    label: "Sidebar active background", description: "Background for the active item in the dashboard sidebar.",
    group: "color",           legacyKey: "sidebar_active_bg_color" },
]
