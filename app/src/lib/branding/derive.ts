import { converter, formatHex, formatRgb, parse } from "culori"
import type { BrandingTokens } from "./tokens"

const toOklch = converter("oklch")
const toRgb = converter("rgb")

const FIXED_SEMANTICS = {
  correct: "#16a34a",
  "correct-light": "#dcfce7",
  present: "#eab308",
  absent: "#94a3b8",
}

const lighten = (hex: string, deltaL: number): string => {
  const c = toOklch(parse(hex))
  if (!c) return hex
  return formatHex({ ...c, l: Math.min(1, Math.max(0, c.l + deltaL)) }) ?? hex
}

const setLightnessChroma = (hex: string, l: number, c: number): string => {
  const col = toOklch(parse(hex))
  if (!col) return hex
  return formatHex({ ...col, l, c }) ?? hex
}

const mix = (a: string, b: string, t: number): string => {
  const ca = toRgb(parse(a))
  const cb = toRgb(parse(b))
  if (!ca || !cb) return a
  return formatHex({
    mode: "rgb",
    r: ca.r * (1 - t) + cb.r * t,
    g: ca.g * (1 - t) + cb.g * t,
    b: ca.b * (1 - t) + cb.b * t,
  }) ?? a
}

const alphaOf = (hex: string, a: number): string => {
  const c = toRgb(parse(hex))
  if (!c) return hex
  return formatRgb({ mode: "rgb", r: c.r, g: c.g, b: c.b, alpha: a }) ?? hex
}

const apcaContrast = (hex: string): number => {
  const c = toOklch(parse(hex))
  return c?.l ?? 0.5
}

const pickForeground = (against: string): string => {
  return apcaContrast(against) < 0.6 ? "#ffffff" : "#0f172a"
}

const isLight = (hex: string): boolean => {
  const c = toOklch(parse(hex))
  return (c?.l ?? 0.5) > 0.6
}

export function deriveTokens(t: BrandingTokens): Record<string, string> {
  const { primary, surface, text, overrides } = t

  const surfaceElevated = isLight(surface) ? lighten(surface, -0.04) : lighten(surface, 0.04)

  const derived: Record<string, string> = {
    primary,
    "primary-hover": lighten(primary, -0.08),
    "primary-light": setLightnessChroma(primary, 0.95, 0.04),
    "primary-foreground": pickForeground(primary),
    surface,
    "surface-elevated": surfaceElevated,
    "surface-muted": mix(surface, primary, 0.04),
    text,
    "text-muted": alphaOf(text, 0.6),
    border: alphaOf(text, 0.12),
    correct: FIXED_SEMANTICS.correct,
    "correct-light": FIXED_SEMANTICS["correct-light"],
    present: FIXED_SEMANTICS.present,
    absent: FIXED_SEMANTICS.absent,
    selection: setLightnessChroma(primary, 0.85, 0.06),
    "selection-ring": primary,
    highlight: setLightnessChroma(primary, 0.9, 0.05),
    "cell-bg": surface,
    "cell-blocked": surfaceElevated,
    "grid-border": alphaOf(text, 0.18),
    "main-word-marker": primary,
    "sidebar-active": pickForeground(primary),
    "sidebar-active-bg": primary,
  }

  for (const [k, v] of Object.entries(overrides)) {
    if (k === "primary" || k === "surface" || k === "text") continue
    derived[k] = v
  }

  return derived
}
