"use client"
import { useMemo } from "react"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"
import { PRESETS } from "@/lib/branding/presets"

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
    if (p) update("tokens", { ...p.tokens, overrides: { ...draft.tokens.overrides, ...p.tokens.overrides } })
  }

  return (
    <>
      {/* Preset bar */}
      <div className="border-b border-border bg-gradient-to-b from-muted/80 to-transparent px-4 py-3.5">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
          Preset themes
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((p) => {
            const isActive =
              draft.tokens.primary === p.tokens.primary &&
              draft.tokens.surface === p.tokens.surface &&
              draft.tokens.text === p.tokens.text
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`flex flex-col items-center gap-1 rounded-md border px-1.5 py-2 text-[10.5px] font-medium transition-all ${
                  isActive
                    ? "border-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_8%,transparent)] text-[var(--primary)]"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/20"
                }`}
              >
                <span className="flex gap-0.5">
                  <span
                    className="h-3.5 w-2.5 rounded-sm border border-black/5"
                    style={{ background: p.tokens.primary }}
                  />
                  <span
                    className="h-3.5 w-2.5 rounded-sm border border-black/5"
                    style={{ background: p.tokens.surface }}
                  />
                  <span
                    className="h-3.5 w-2.5 rounded-sm border border-black/5"
                    style={{ background: p.tokens.text }}
                  />
                </span>
                {p.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Colors section */}
      <details open className="bp-section">
        <summary className="bp-header">
          <ChevronRight className="bp-chevron" />
          <span>Colors</span>
          <span className="ml-auto font-mono text-[10px] font-medium text-muted-foreground">3 tokens</span>
        </summary>
        <div className="bp-body">
        {(
          [
            { key: "primary" as const, label: "Primary", hint: "brand accent", uses: "14×" },
            { key: "surface" as const, label: "Surface", hint: "backgrounds", uses: "22×" },
            { key: "text" as const, label: "Text", hint: "body + headings", uses: "31×" },
          ]
        ).map(({ key, label, hint, uses }) => (
          <div
            key={key}
            className="flex flex-col gap-1"
            onMouseEnter={() => onTokenHover?.(key)}
            onMouseLeave={() => onTokenHover?.(null)}
            onFocus={() => onTokenHover?.(key)}
            onBlur={() => onTokenHover?.(null)}
          >
            <div className="bp-field-label">
              <span>{label}</span>
              <span className="bp-hint">{hint}</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 transition-colors hover:border-foreground/20">
              <div className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-[5px] border border-black/10">
                <input
                  type="color"
                  aria-label={`${label} color`}
                  value={draft.tokens[key]}
                  onChange={(e) => setSeed(key, e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer border-none opacity-0"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[4px]" style={{ background: draft.tokens[key] }} />
              </div>
              <input
                id={`brand-seed-${key}`}
                type="text"
                value={draft.tokens[key]}
                onChange={(e) => setSeed(key, e.target.value)}
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-xs lowercase text-foreground outline-none"
                aria-label={`${label} hex value`}
              />
              <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {uses}
              </span>
            </div>
          </div>
        ))}
        </div>
      </details>
    </>
  )
}
