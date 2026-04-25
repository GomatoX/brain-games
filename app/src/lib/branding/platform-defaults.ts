// Sentinel IDs for the seeded platform-default org and sample puzzles.
// Used by the branding editor's preview pane to render real game embeds
// without depending on any user-authored content.
//
// Sentinel UUIDs (zero-prefixed) are easy to recognise in the DB and won't
// collide with `crypto.randomUUID()` output.

export const PLATFORM_ORG_ID = "00000000-0000-0000-0000-000000000001"
export const PLATFORM_USER_ID = "00000000-0000-0000-0000-000000000002"

export const PLATFORM_PUZZLE_IDS = {
  crossword:  "00000000-0000-0000-0000-000000000010",
  wordsearch: "00000000-0000-0000-0000-000000000011",
  wordgame:   "00000000-0000-0000-0000-000000000012",
} as const

export type PreviewGameType = keyof typeof PLATFORM_PUZZLE_IDS
