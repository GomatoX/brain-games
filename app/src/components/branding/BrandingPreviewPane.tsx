"use client"
import { useMemo, useState } from "react"
import type { DraftState } from "./BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import { FIELD_MAP, TYPOGRAPHY_VARS, SCALE_VARS, DENSITY_VARS, radiusVars } from "@/lib/branding/field-map"
import DashboardPreview from "./preview/DashboardPreview"
import GamePreview from "./preview/GamePreview"
import LoginPreview from "./preview/LoginPreview"

type Tab = "dashboard" | "game" | "login"

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
  const [tab, setTab] = useState<Tab>("dashboard")
  const cssVars = useMemo(() => buildVars(draft), [draft])

  return (
    <div className="p-6">
      <nav className="flex gap-2 mb-4">
        {(["dashboard", "game", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 border rounded ${tab === t ? "text-white" : ""}`}
            style={tab === t ? { background: "var(--primary)" } : undefined}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
      <div data-brand-preview style={cssVars as React.CSSProperties}>
        {tab === "dashboard" && <DashboardPreview draft={draft} />}
        {tab === "game" && <GamePreview />}
        {tab === "login" && <LoginPreview draft={draft} />}
      </div>
    </div>
  )
}
