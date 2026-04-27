import { describe, it, expect } from "vitest"
import { TOKEN_REGISTRY } from "../branding/token-registry"
import { deriveTokens } from "../branding/derive"

const VALID_GROUPS = new Set(["color", "surface", "state", "feedback", "structural"])

describe("TOKEN_REGISTRY", () => {
  it("every entry has non-empty fields and at least one cssVar", () => {
    for (const t of TOKEN_REGISTRY) {
      expect(t.id, `id missing`).toBeTruthy()
      expect(t.label, `${t.id}: label missing`).toBeTruthy()
      expect(t.description, `${t.id}: description missing`).toBeTruthy()
      expect(t.cssVars.length, `${t.id}: cssVars empty`).toBeGreaterThan(0)
      expect(VALID_GROUPS.has(t.group), `${t.id}: invalid group ${t.group}`).toBe(true)
    }
  })

  it("all ids are unique", () => {
    const ids = TOKEN_REGISTRY.map((t) => t.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("all CSS variables are unique across the registry", () => {
    const vars = TOKEN_REGISTRY.flatMap((t) => t.cssVars)
    expect(new Set(vars).size).toBe(vars.length)
  })

  it("covers every token name produced by deriveTokens", () => {
    const derived = deriveTokens({
      primary: "#c25e40", surface: "#ffffff", text: "#0f172a", overrides: {},
    })
    const registryIds = new Set(TOKEN_REGISTRY.map((t) => t.id))
    for (const k of Object.keys(derived)) {
      expect(registryIds.has(k), `derived token "${k}" has no registry entry`).toBe(true)
    }
  })

  it("every derived token's id has matching cssVars on the registry (replaces FIELD_MAP compat)", () => {
    const derived = deriveTokens({
      primary: "#c25e40", surface: "#ffffff", text: "#0f172a", overrides: {},
    })
    const byId = new Map(TOKEN_REGISTRY.map((t) => [t.id, t]))
    for (const k of Object.keys(derived)) {
      const def = byId.get(k)
      expect(def, `derived token "${k}" has no registry entry`).toBeTruthy()
      expect(def!.cssVars.length, `derived token "${k}" has empty cssVars`).toBeGreaterThan(0)
    }
  })

  // Locks the exact (id → cssVars) shape so silent removal of a legacy var
  // alias (e.g. dropping --bg-primary from "surface" — which would break old
  // game CSS that still reads --bg-primary) is caught at test time.
  // Mirrors what the deleted branding-field-map-compat snapshot guarded.
  it("(id → cssVars) shape is byte-stable for every token", () => {
    const shape: Record<string, string[]> = Object.fromEntries(
      TOKEN_REGISTRY.map((t) => [t.id, t.cssVars]),
    )
    expect(shape).toEqual({
      "primary":            ["--primary", "--accent"],
      "primary-hover":      ["--primary-hover", "--accent-hover"],
      "primary-light":      ["--primary-light", "--accent-light"],
      "primary-foreground": ["--primary-foreground"],
      "surface":            ["--surface", "--bg-primary"],
      "surface-elevated":   ["--surface-elevated", "--bg-secondary"],
      "surface-muted":      ["--surface-muted"],
      "text":               ["--text", "--text-primary"],
      "text-muted":         ["--text-muted", "--text-secondary"],
      "border":             ["--border", "--border-color"],
      "correct":            ["--correct"],
      "correct-light":      ["--correct-light"],
      "present":            ["--present"],
      "absent":             ["--absent"],
      "selection":          ["--selection", "--cell-selected", "--cell-selected-bg"],
      "selection-ring":     ["--selection-ring", "--cell-selected-ring"],
      "highlight":          ["--highlight", "--cell-highlighted", "--cell-related"],
      "cell-bg":            ["--cell-bg"],
      "cell-blocked":       ["--cell-blocked"],
      "grid-border":        ["--grid-border"],
      "main-word-marker":   ["--main-word-marker"],
      "sidebar-active":     ["--sidebar-active"],
      "sidebar-active-bg":  ["--sidebar-active-bg"],
    })
  })
})
