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
})
