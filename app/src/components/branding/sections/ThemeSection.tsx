"use client"
import { useMemo } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  // Open the details panel automatically if the user has already pinned any
  // derivative — otherwise keep it closed so a typical session shows just the
  // three brand seeds.
  const detailsOpen = hasThemeDetailOverrides(draft.tokens.overrides)

  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Theme</summary>
      <div className="mt-3 space-y-3">
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
            className="block text-sm rounded px-1 -mx-1 hover:bg-accent focus-within:bg-accent"
            onMouseEnter={() => onTokenHover?.(k)}
            onMouseLeave={() => onTokenHover?.(null)}
            onFocus={() => onTokenHover?.(k)}
            onBlur={() => onTokenHover?.(null)}
          >
            <Label className="block mb-1 capitalize" htmlFor={`brand-seed-${k}`}>
              {k}
            </Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                aria-label={`${k} color`}
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
                className="h-9 w-10 rounded border border-input cursor-pointer bg-background"
              />
              <Input
                id={`brand-seed-${k}`}
                type="text"
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        ))}

        <details open={detailsOpen} className="mt-2 border-t pt-2">
          <summary className="text-sm cursor-pointer text-slate-600">
            Theme details (auto-derived) ·{" "}
            <span className="text-slate-400">{THEME_DETAIL_TOKENS.length} tokens</span>
          </summary>
          <div className="mt-2 space-y-1">
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
