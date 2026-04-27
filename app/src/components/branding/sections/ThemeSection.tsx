"use client"
import type { DraftState } from "../BrandingEditor"
import { PRESETS } from "@/lib/branding/presets"
import SelectField from "../fields/SelectField"

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
          <label
            key={k}
            className="block text-sm rounded px-1 -mx-1 hover:bg-slate-50 focus-within:bg-slate-50"
            onMouseEnter={() => onTokenHover?.(k)}
            onMouseLeave={() => onTokenHover?.(null)}
            onFocus={() => onTokenHover?.(k)}
            onBlur={() => onTokenHover?.(null)}
          >
            <span className="block mb-1 capitalize">{k}</span>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
              />
              <input
                type="text"
                className="border rounded px-2 py-1 flex-1"
                value={draft.tokens[k]}
                onChange={(e) => setSeed(k, e.target.value)}
              />
            </div>
          </label>
        ))}
      </div>
    </details>
  )
}
