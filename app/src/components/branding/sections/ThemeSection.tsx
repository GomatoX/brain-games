"use client"
import { useMemo } from "react"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"
import { PRESETS } from "@/lib/branding/presets"
import SelectField from "../fields/SelectField"
import TokenRow from "./TokenRow"
import { deriveTokens } from "@/lib/branding/derive"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"
import {
  THEME_DETAIL_TOKENS,
  hasThemeDetailOverrides,
} from "@/lib/branding/section-groups"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
  onTokenHover?: (id: string | null) => void
}

export default function ThemeSection({ draft, update, onTokenHover }: Props) {
  const setSeed = (k: "primary" | "surface" | "text", v: string) =>
    update("tokens", { ...draft.tokens, [k]: v })

  const applyPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)
    if (p) update("tokens", { ...p.tokens, overrides: draft.tokens.overrides })
  }

  const setOverride = (key: string, value: string | null) => {
    const next = { ...draft.tokens.overrides }
    if (value === null) delete next[key]
    else next[key] = value
    update("tokens", { ...draft.tokens, overrides: next })
  }

  const derived = useMemo(() => deriveTokens(draft.tokens), [draft.tokens])
  const detailTokens = useMemo(
    () =>
      THEME_DETAIL_TOKENS.map((id) => TOKEN_REGISTRY.find((t) => t.id === id)!),
    [],
  )
  const detailsOpen = hasThemeDetailOverrides(draft.tokens.overrides)

  return (
    <details open className="bp-section">
      <summary className="bp-header">
        <ChevronRight className="bp-chevron" />
        Theme
      </summary>
      <div className="bp-body">
        <SelectField
          label="Preset"
          value=""
          placeholder="Pick a preset…"
          options={PRESETS.map((p) => ({ value: p.id, label: p.name }))}
          onChange={(id) => applyPreset(id)}
        />
        {(["primary", "surface", "text"] as const).map((k) => (
          <div
            key={k}
            className="bp-prop"
            onMouseEnter={() => onTokenHover?.(k)}
            onMouseLeave={() => onTokenHover?.(null)}
            onFocus={() => onTokenHover?.(k)}
            onBlur={() => onTokenHover?.(null)}
          >
            <span className="bp-prop-label">{k}</span>
            <div className="bp-prop-control">
              <input
                type="color"
                aria-label={`${k} color`}
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
                className="bp-swatch"
              />
              <input
                id={`brand-seed-${k}`}
                type="text"
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
                className="bp-hex-input"
                aria-label={`${k} hex value`}
              />
            </div>
          </div>
        ))}

        <details open={detailsOpen} className="bp-subsection">
          <summary className="bp-subsection-header">
            <ChevronRight className="bp-chevron" />
            <span>Theme details (auto-derived)</span>
            <span className="ml-1 opacity-50">· {THEME_DETAIL_TOKENS.length} tokens</span>
          </summary>
          <div className="mt-1.5 flex flex-col gap-0.5">
            {detailTokens.map((t) => {
              const isPinned = t.id in draft.tokens.overrides
              const value = isPinned ? draft.tokens.overrides[t.id] : derived[t.id]
              return (
                <TokenRow
                  key={t.id}
                  token={t}
                  value={value}
                  isPinned={isPinned}
                  onPin={(v) => setOverride(t.id, v)}
                  onReset={() => setOverride(t.id, null)}
                  onChange={(v) => setOverride(t.id, v)}
                  onHover={onTokenHover}
                />
              )
            })}
          </div>
        </details>
      </div>
    </details>
  )
}
