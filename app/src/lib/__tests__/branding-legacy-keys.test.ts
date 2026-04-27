import { describe, it, expect } from "vitest"
import { LEGACY_COLUMN_TO_TOKEN_ID } from "../branding/backfill"

// Locks the shape so registry edits in either direction are an explicit decision.
const SNAPSHOT: Record<string, string> = {
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

describe("LEGACY_COLUMN_TO_TOKEN_ID", () => {
  it("matches the published shape exactly (regression guard for backfill behaviour)", () => {
    expect(LEGACY_COLUMN_TO_TOKEN_ID).toEqual(SNAPSHOT)
  })
})
