"use client"
import { useMemo } from "react"
import type { DraftState } from "../BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import { FIELD_MAP } from "@/lib/branding/field-map"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function AdvancedSection({ draft, update }: Props) {
  const derived = useMemo(() => deriveTokens(draft.tokens), [draft.tokens])
  const tokenNames = Object.keys(FIELD_MAP).filter(
    (k) => k !== "primary" && k !== "surface" && k !== "text",
  )

  const setOverride = (key: string, value: string | null) => {
    const next = { ...draft.tokens.overrides }
    if (value === null) delete next[key]
    else next[key] = value
    update("tokens", { ...draft.tokens, overrides: next })
  }

  return (
    <details className="mb-4">
      <summary className="font-semibold cursor-pointer">Advanced overrides</summary>
      <div className="mt-3 space-y-1 text-xs">
        {tokenNames.map((name) => {
          const isPinned = name in draft.tokens.overrides
          const value = isPinned ? draft.tokens.overrides[name] : derived[name]
          return (
            <div key={name} className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 border rounded"
                style={{ background: value }}
              />
              <span className="font-mono w-40 truncate">{name}</span>
              {isPinned ? (
                <>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setOverride(name, e.target.value)}
                    className="w-8 h-6"
                  />
                  <button onClick={() => setOverride(name, null)} className="text-blue-600">
                    Reset
                  </button>
                </>
              ) : (
                <button onClick={() => setOverride(name, value)} className="text-blue-600">
                  Pin / customize
                </button>
              )}
            </div>
          )
        })}
      </div>
    </details>
  )
}
