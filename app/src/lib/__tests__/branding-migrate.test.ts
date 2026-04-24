import { describe, it, expect } from "vitest"
import { backfillRow, type OldBrandingRow } from "../branding/backfill"

const DEFAULTS = { primary: "#c25e40", surface: "#ffffff", text: "#0f172a" }

const emptyRow = (overrides: Partial<OldBrandingRow> = {}): OldBrandingRow => ({
  id: "x",
  accent_color: null, accent_hover_color: null, accent_light_color: null,
  selection_color: null, selection_ring_color: null, highlight_color: null,
  correct_color: null, correct_light_color: null, present_color: null,
  absent_color: null, bg_primary_color: null, bg_secondary_color: null,
  text_primary_color: null, text_secondary_color: null, border_color: null,
  cell_bg_color: null, cell_blocked_color: null, sidebar_active_color: null,
  sidebar_active_bg_color: null, grid_border_color: null,
  main_word_marker_color: null, font_sans: null, font_serif: null,
  border_radius: null,
  ...overrides,
})

describe("backfillRow", () => {
  it("maps accent_color → tokens.primary", () => {
    const out = backfillRow(emptyRow({ accent_color: "#ff0000" }), DEFAULTS)
    expect(out.tokens.primary).toBe("#ff0000")
  })

  it("falls back to defaults when seed fields are null", () => {
    const out = backfillRow(emptyRow(), DEFAULTS)
    expect(out.tokens.primary).toBe("#c25e40")
    expect(out.tokens.surface).toBe("#ffffff")
    expect(out.tokens.text).toBe("#0f172a")
  })

  it("moves all non-seed flat fields into overrides under their derived-token names", () => {
    const out = backfillRow(
      emptyRow({
        accent_hover_color: "#a84d33",
        cell_bg_color: "#f8fafc",
        main_word_marker_color: "#16a34a",
      }),
      DEFAULTS,
    )
    expect(out.tokens.overrides["primary-hover"]).toBe("#a84d33")
    expect(out.tokens.overrides["cell-bg"]).toBe("#f8fafc")
    expect(out.tokens.overrides["main-word-marker"]).toBe("#16a34a")
  })

  it("parses numeric border-radius from string and falls back to 8", () => {
    expect(backfillRow(emptyRow({ border_radius: "12px" }), DEFAULTS).spacing.radius).toBe(12)
    expect(backfillRow(emptyRow({ border_radius: "garbage" }), DEFAULTS).spacing.radius).toBe(8)
    expect(backfillRow(emptyRow(), DEFAULTS).spacing.radius).toBe(8)
  })

  it("preserves font fields verbatim", () => {
    const out = backfillRow(
      emptyRow({ font_sans: "Inter, sans-serif", font_serif: "Playfair Display, serif" }),
      DEFAULTS,
    )
    expect(out.typography.fontSans).toBe("Inter, sans-serif")
    expect(out.typography.fontSerif).toBe("Playfair Display, serif")
  })

  it("populates components with sensible defaults (no equivalent in old data)", () => {
    const out = backfillRow(emptyRow(), DEFAULTS)
    expect(out.components.button.variant).toBe("solid")
    expect(out.components.input.variant).toBe("outlined")
    expect(out.components.card.elevation).toBe("subtle")
  })
})
