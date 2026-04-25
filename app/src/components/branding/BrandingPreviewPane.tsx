"use client"
import { useMemo } from "react"
import type { DraftState } from "./BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import {
  FIELD_MAP,
  TYPOGRAPHY_VARS,
  SCALE_VARS,
  DENSITY_VARS,
  radiusVars,
} from "@/lib/branding/field-map"
import GamePreview from "./preview/GamePreview"

function buildVars(draft: DraftState): Record<string, string> {
  const derived = deriveTokens(draft.tokens)
  const out: Record<string, string> = {}
  for (const [tokenName, vars] of Object.entries(FIELD_MAP)) {
    const v = derived[tokenName]
    if (!v) continue
    for (const cv of vars) out[cv] = v
  }
  if (draft.typography.fontSans) out[TYPOGRAPHY_VARS.fontSans] = draft.typography.fontSans
  if (draft.typography.fontSerif) out[TYPOGRAPHY_VARS.fontSerif] = draft.typography.fontSerif
  Object.assign(out, SCALE_VARS[draft.typography.scale])
  Object.assign(out, DENSITY_VARS[draft.spacing.density])
  Object.assign(out, radiusVars(draft.spacing.radius))
  return out
}

export default function BrandingPreviewPane({ draft }: { draft: DraftState }) {
  const cssVars = useMemo(() => buildVars(draft), [draft])
  return (
    <div className="p-6">
      <div data-brand-preview style={cssVars as React.CSSProperties}>
        <GamePreview />
      </div>
    </div>
  )
}
