import { describe, it, expect } from "vitest"
import { FIELD_MAP } from "../branding/field-map"

const SNAPSHOT: Record<string, string[]> = {
  primary: ["--primary", "--accent"],
  "primary-hover": ["--primary-hover", "--accent-hover"],
  "primary-light": ["--primary-light", "--accent-light"],
  "primary-foreground": ["--primary-foreground"],
  surface: ["--surface", "--bg-primary"],
  "surface-elevated": ["--surface-elevated", "--bg-secondary"],
  "surface-muted": ["--surface-muted"],
  text: ["--text", "--text-primary"],
  "text-muted": ["--text-muted", "--text-secondary"],
  border: ["--border", "--border-color"],
  correct: ["--correct"],
  "correct-light": ["--correct-light"],
  present: ["--present"],
  absent: ["--absent"],
  selection: ["--selection", "--cell-selected", "--cell-selected-bg"],
  "selection-ring": ["--selection-ring", "--cell-selected-ring"],
  highlight: ["--highlight", "--cell-highlighted", "--cell-related"],
  "cell-bg": ["--cell-bg"],
  "cell-blocked": ["--cell-blocked"],
  "grid-border": ["--grid-border"],
  "main-word-marker": ["--main-word-marker"],
  "sidebar-active": ["--sidebar-active"],
  "sidebar-active-bg": ["--sidebar-active-bg"],
}

describe("FIELD_MAP compatibility", () => {
  it("matches the published shape exactly (regression guard for resolve.ts)", () => {
    expect(FIELD_MAP).toEqual(SNAPSHOT)
  })
})
