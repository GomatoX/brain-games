"use client"
import { useMemo, useState } from "react"
import {
  Monitor, Tablet, Smartphone, RotateCw, ExternalLink,
} from "lucide-react"
import type { DraftState } from "./BrandingEditor"
import { deriveTokens } from "@/lib/branding/derive"
import {
  TYPOGRAPHY_VARS,
  SCALE_VARS,
  DENSITY_VARS,
  radiusVars,
} from "@/lib/branding/css-vars"
import { TOKEN_REGISTRY } from "@/lib/branding/token-registry"
import GamePreview from "./preview/GamePreview"
import type { PreviewGameType } from "@/lib/branding/platform-defaults"

function buildVars(draft: DraftState): Record<string, string> {
  const derived = deriveTokens(draft.tokens)
  const out: Record<string, string> = {}
  for (const t of TOKEN_REGISTRY) {
    const v = derived[t.id]
    if (!v) continue
    for (const cv of t.cssVars) out[cv] = v
  }
  if (draft.typography.fontSans) out[TYPOGRAPHY_VARS.fontSans] = draft.typography.fontSans
  if (draft.typography.fontSerif) out[TYPOGRAPHY_VARS.fontSerif] = draft.typography.fontSerif
  Object.assign(out, SCALE_VARS[draft.typography.scale])
  Object.assign(out, DENSITY_VARS[draft.spacing.density])
  Object.assign(out, radiusVars(draft.spacing.radius))
  return out
}

type Device = "desktop" | "tablet" | "phone"

type PreviewProps = {
  draft: DraftState
  hoveredToken?: string | null
  availableGameTypes: PreviewGameType[]
  defaultGameType: PreviewGameType | null
}

export default function BrandingPreviewPane({
  draft,
  hoveredToken,
  availableGameTypes,
  defaultGameType,
}: PreviewProps) {
  const cssVars = useMemo(() => buildVars(draft), [draft])
  const [device, setDevice] = useState<Device>("desktop")

  const stageMaxWidth = device === "phone" ? 375 : device === "tablet" ? 600 : undefined
  const resLabel = device === "phone" ? "375×667" : device === "tablet" ? "768×1024" : "fluid"

  const fontSansLabel = draft.typography.fontSans
    ? draft.typography.fontSans.split(",")[0].trim()
    : "System"
  const fontSerifLabel = draft.typography.fontSerif
    ? draft.typography.fontSerif.split(",")[0].trim()
    : null

  return (
    <GamePreview.Provider availableTypes={availableGameTypes} defaultType={defaultGameType}>
      <div
        className="flex h-full flex-col"
        style={{
          background: `
            radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0) 0 0 / 18px 18px,
            hsl(var(--muted))
          `,
        }}
      >
        {/* Hide "Powered by" badge inside game embeds */}
        <style>{`
          [data-brand-preview] .powered-by { display: none !important; }
        `}</style>

        {hoveredToken && (
          <style>{`
            [data-brand-preview] [data-brand-token="${hoveredToken}"] {
              outline: 2px dashed #ff00aa !important;
              outline-offset: 2px;
              transition: outline-color 100ms;
            }
          `}</style>
        )}

        {/* Preview header — game tabs + device toggles */}
        <div className="flex shrink-0 items-end justify-between gap-4 px-5 pt-3">
          <GamePreview.Tabs
            availableTypes={availableGameTypes}
            defaultType={defaultGameType}
          />
          <div className="flex items-center gap-1.5 pb-1.5">
            {([
              { id: "phone" as Device, icon: Smartphone, label: "Phone" },
              { id: "tablet" as Device, icon: Tablet, label: "Tablet" },
              { id: "desktop" as Device, icon: Monitor, label: "Desktop" },
            ]).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => setDevice(id)}
                className={`grid h-[30px] w-[30px] place-items-center rounded-md border transition-colors ${
                  device === id
                    ? "border-transparent bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-[var(--primary)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-card"
                }`}
              >
                <Icon className="size-4" />
              </button>
            ))}
            <div className="mx-1 h-4 w-px bg-border" />
            <button
              type="button"
              title="Refresh"
              className="grid h-[30px] w-[30px] place-items-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-card"
            >
              <RotateCw className="size-4" />
            </button>
            <button
              type="button"
              title="Open in new window"
              className="grid h-[30px] w-[30px] place-items-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-card"
            >
              <ExternalLink className="size-4" />
            </button>
          </div>
        </div>

        {/* Preview stage */}
        <div className="mx-5 mb-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[0_10px_10px_10px] border border-border bg-card">
          <div className="flex flex-1 items-start justify-center overflow-auto p-6">
            <div
              data-brand-preview
              style={{
                ...cssVars as React.CSSProperties,
                maxWidth: stageMaxWidth,
                width: "100%",
              }}
            >
              <GamePreview.Stage
                availableTypes={availableGameTypes}
                defaultType={defaultGameType}
              />
            </div>
          </div>

          {/* Status bar */}
          <div className="flex shrink-0 items-center gap-3.5 border-t border-border bg-muted px-3.5 py-2 font-mono text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 text-green-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-600" />
              LIVE
            </span>
            <span className="h-2.5 w-px bg-border" />
            <span>{fontSansLabel}{fontSerifLabel ? ` · ${fontSerifLabel}` : ""}</span>
            <span className="h-2.5 w-px bg-border" />
            <span>radius {draft.spacing.radius}px</span>
            <span className="h-2.5 w-px bg-border" />
            <span className="opacity-70">{draft.tokens.primary} / {draft.tokens.surface} / {draft.tokens.text}</span>
            <span className="flex-1" />
            <span>{resLabel}</span>
          </div>
        </div>
      </div>
    </GamePreview.Provider>
  )
}
