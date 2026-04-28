// Single source of truth for how the 23 brand tokens are partitioned across
// editor sections. Importers: ThemeSection (core + details), GameColorsSection
// (the three sub-groups). The coverage assertion in
// `app/src/lib/__tests__/branding-section-groups.test.ts` keeps this file in
// sync with TOKEN_REGISTRY.

export const THEME_CORE_TOKENS = ["primary", "surface", "text"] as const

export const THEME_DETAIL_TOKENS = [
  "primary-hover",
  "primary-light",
  "primary-foreground",
  "text-muted",
  "surface-elevated",
  "surface-muted",
] as const

export type GameColorGroupId = "state-feedback" | "grid" | "sidebar"

export type GameColorGroup = {
  id: GameColorGroupId
  label: string
  description: string
  tokenIds: readonly string[]
}

export const GAME_COLOR_GROUPS: readonly GameColorGroup[] = [
  {
    id: "state-feedback",
    label: "State feedback",
    description: "Colours that signal correctness, selection, and active hints during play.",
    tokenIds: [
      "correct",
      "correct-light",
      "present",
      "absent",
      "selection",
      "selection-ring",
      "highlight",
      "main-word-marker",
    ],
  },
  {
    id: "grid",
    label: "Grid",
    description: "How individual grid cells and their borders are drawn.",
    tokenIds: ["cell-bg", "cell-blocked", "grid-border", "border"],
  },
  {
    id: "sidebar",
    label: "Sidebar",
    description: "Active item styling in the dashboard sidebar.",
    tokenIds: ["sidebar-active", "sidebar-active-bg"],
  },
]

const THEME_DETAIL_SET = new Set<string>(THEME_DETAIL_TOKENS)

export const hasThemeDetailOverrides = (
  overrides: Record<string, string>,
): boolean => {
  for (const k of Object.keys(overrides)) {
    if (THEME_DETAIL_SET.has(k)) return true
  }
  return false
}
