"use client"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"

const DENSITY_OPTIONS = ["Compact", "Comfortable", "Spacious"] as const

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft, update }: Props) {
  return (
    <details open className="bp-section">
      <summary className="bp-header">
        <ChevronRight className="bp-chevron" />
        <span>Shape &amp; spacing</span>
        <span className="ml-auto font-mono text-[10px] font-medium text-muted-foreground">2 tokens</span>
      </summary>
      <div className="bp-body">
        <div className="flex flex-col gap-[5px]">
          <label className="bp-field-label">
            Corner radius
            <span className="bp-hint">{draft.spacing.radius}px</span>
          </label>
          <div className="bp-slider-wrap">
            <input
              type="range"
              className="bp-slider"
              min={0}
              max={40}
              step={1}
              value={draft.spacing.radius}
              onChange={(e) =>
                update("spacing", { ...draft.spacing, radius: Number(e.target.value) })
              }
              aria-label="Corner radius"
            />
            <span className="bp-slider-value">{draft.spacing.radius}px</span>
          </div>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label className="bp-field-label">Density</label>
          <div
            className="bp-segmented"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {DENSITY_OPTIONS.map((v) => {
              const mapping: Record<string, DraftState["spacing"]["density"]> = {
                Compact: "compact",
                Comfortable: "cozy",
                Spacious: "comfortable",
              }
              const reverseMapping: Record<string, string> = {
                compact: "Compact",
                cozy: "Comfortable",
                comfortable: "Spacious",
              }
              const isActive = reverseMapping[draft.spacing.density] === v
              return (
                <button
                  key={v}
                  type="button"
                  className={isActive ? "active" : ""}
                  onClick={() =>
                    update("spacing", {
                      ...draft.spacing,
                      density: mapping[v],
                    })
                  }
                >
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </details>
  )
}
