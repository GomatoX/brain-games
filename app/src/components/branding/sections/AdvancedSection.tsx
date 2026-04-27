"use client"
import { useMemo } from "react"
import type { DraftState } from "../BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"
import HelpHint from "../fields/HelpHint"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
  onTokenHover?: (id: string | null) => void
}

const SKIP_IDS = new Set(["primary", "surface", "text"])

export default function AdvancedSection({ draft, update, onTokenHover }: Props) {
  const derived = useMemo(() => deriveTokens(draft.tokens), [draft.tokens])
  const tokens = TOKEN_REGISTRY.filter((t) => !SKIP_IDS.has(t.id))

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
        {tokens.map((t) => {
          const isPinned = t.id in draft.tokens.overrides
          const value = isPinned ? draft.tokens.overrides[t.id] : derived[t.id]
          return (
            <div
              key={t.id}
              className="flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50 focus-within:bg-slate-50"
              onMouseEnter={() => onTokenHover?.(t.id)}
              onMouseLeave={() => onTokenHover?.(null)}
              onFocus={() => onTokenHover?.(t.id)}
              onBlur={() => onTokenHover?.(null)}
            >
              <span className="inline-block w-4 h-4 border rounded shrink-0" style={{ background: value }} />
              <span className="font-medium truncate">{t.label}</span>
              <HelpHint text={t.description} />
              <span className="font-mono text-[10px] text-slate-400 ml-auto truncate">{t.id}</span>
              {isPinned ? (
                <>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setOverride(t.id, e.target.value)}
                    className="w-8 h-6 shrink-0"
                  />
                  <button onClick={() => setOverride(t.id, null)} className="text-blue-600 shrink-0">
                    Reset
                  </button>
                </>
              ) : (
                <button onClick={() => setOverride(t.id, value)} className="text-blue-600 shrink-0">
                  Pin
                </button>
              )}
            </div>
          )
        })}
      </div>
    </details>
  )
}
