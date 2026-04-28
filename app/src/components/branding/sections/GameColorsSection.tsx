"use client"
import { useMemo } from "react"
import type { DraftState } from "../BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"
import { GAME_COLOR_GROUPS } from "@/lib/branding/section-groups"
import TokenRow from "./TokenRow"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
  onTokenHover?: (id: string | null) => void
}

export default function GameColorsSection({ draft, update, onTokenHover }: Props) {
  const derived = useMemo(() => deriveTokens(draft.tokens), [draft.tokens])
  const tokenById = useMemo(() => {
    const map: Record<string, (typeof TOKEN_REGISTRY)[number]> = {}
    for (const t of TOKEN_REGISTRY) map[t.id] = t
    return map
  }, [])

  const setOverride = (key: string, value: string | null) => {
    const next = { ...draft.tokens.overrides }
    if (value === null) delete next[key]
    else next[key] = value
    update("tokens", { ...draft.tokens, overrides: next })
  }

  return (
    <details className="mb-4">
      <summary className="font-semibold cursor-pointer">Game colors</summary>
      <p className="mt-2 text-xs text-slate-500">
        Fine-grained control over how cells, selections, and feedback render in
        each game. Most of these auto-derive from your brand palette — pin a
        token to override its computed value.
      </p>
      <div className="mt-3 space-y-4">
        {GAME_COLOR_GROUPS.map((group) => (
          <div key={group.id}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
              {group.label}
            </h3>
            <p className="text-[11px] text-slate-400 mb-1">{group.description}</p>
            <div className="space-y-1">
              {group.tokenIds.map((id) => {
                const t = tokenById[id]
                if (!t) return null
                const isPinned = id in draft.tokens.overrides
                const value = isPinned ? draft.tokens.overrides[id] : derived[id]
                return (
                  <TokenRow
                    key={id}
                    token={t}
                    value={value}
                    isPinned={isPinned}
                    onPin={(v) => setOverride(id, v)}
                    onReset={() => setOverride(id, null)}
                    onChange={(v) => setOverride(id, v)}
                    onHover={onTokenHover}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </details>
  )
}
