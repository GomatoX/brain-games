"use client"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function ComponentsSection({ draft, update }: Props) {
  return (
    <>
      <details open className="bp-section">
        <summary className="bp-header">
          <ChevronRight className="bp-chevron" />
          <span>Buttons</span>
        </summary>
        <div className="bp-body">
          <div className="flex flex-col gap-[5px]">
            <label className="bp-field-label">Primary variant</label>
            <div className="bp-variant-grid">
              {([
                { id: "solid", label: "Solid" },
                { id: "outline", label: "Outline" },
                { id: "ghost-fill", label: "Soft" },
              ] as const).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  className={`bp-variant-card ${draft.components.button.variant === v.id ? "active" : ""}`}
                  onClick={() =>
                    update("components", {
                      ...draft.components,
                      button: { ...draft.components.button, variant: v.id as DraftState["components"]["button"]["variant"] },
                    })
                  }
                >
                  <span
                    className="grid h-[22px] min-w-[44px] place-items-center rounded px-2.5 text-[10px] font-semibold tracking-wide"
                    style={{
                      background:
                        v.id === "solid"
                          ? draft.tokens.primary
                          : v.id === "ghost-fill"
                            ? `color-mix(in oklab, ${draft.tokens.primary} 18%, ${draft.tokens.surface})`
                            : "transparent",
                      color: v.id === "solid" ? "#fff" : draft.tokens.primary,
                      border: v.id === "outline" ? `1.5px solid ${draft.tokens.primary}` : "none",
                      borderRadius: `${Math.min(draft.spacing.radius * 0.4, 12)}px`,
                    }}
                  >
                    Aa
                  </span>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      <details open className="bp-section">
        <summary className="bp-header">
          <ChevronRight className="bp-chevron" />
          <span>Cells &amp; tiles</span>
        </summary>
        <div className="bp-body">
          <div className="flex flex-col gap-[5px]">
            <label className="bp-field-label">Tile fill</label>
            <div className="bp-segmented" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {(["flat", "subtle", "lifted"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={draft.components.card.elevation === v ? "active" : ""}
                  onClick={() =>
                    update("components", {
                      ...draft.components,
                      card: { elevation: v },
                    })
                  }
                >
                  {v === "flat" ? "Flat" : v === "subtle" ? "Soft" : "Bordered"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[5px]">
            <label className="bp-field-label">Input style</label>
            <div className="bp-segmented" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {(["outlined", "filled"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={draft.components.input.variant === v ? "active" : ""}
                  onClick={() =>
                    update("components", {
                      ...draft.components,
                      input: { variant: v },
                    })
                  }
                >
                  {v === "outlined" ? "Outlined" : "Filled"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </>
  )
}
