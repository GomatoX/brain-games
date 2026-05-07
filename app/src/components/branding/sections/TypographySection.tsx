"use client"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"

const SANS_FONTS = [
  { v: "Inter, sans-serif", label: "Inter (default)" },
  { v: "Roboto, sans-serif", label: "Roboto" },
  { v: "Open Sans, sans-serif", label: "Open Sans" },
  { v: "Lato, sans-serif", label: "Lato" },
  { v: "Montserrat, sans-serif", label: "Montserrat" },
  { v: "Poppins, sans-serif", label: "Poppins" },
  { v: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
  { v: "Nunito, sans-serif", label: "Nunito" },
  { v: "Work Sans, sans-serif", label: "Work Sans" },
  { v: "DM Sans, sans-serif", label: "DM Sans" },
  { v: "Manrope, sans-serif", label: "Manrope" },
  { v: "system-ui, sans-serif", label: "System UI" },
]
const SERIF_FONTS = [
  { v: "Playfair Display, serif", label: "Playfair Display" },
  { v: "Merriweather, serif", label: "Merriweather" },
  { v: "Lora, serif", label: "Lora" },
  { v: "PT Serif, serif", label: "PT Serif" },
  { v: "Crimson Text, serif", label: "Crimson Text" },
  { v: "EB Garamond, serif", label: "EB Garamond" },
  { v: "Cormorant Garamond, serif", label: "Cormorant Garamond" },
  { v: "Libre Baskerville, serif", label: "Libre Baskerville" },
  { v: "Spectral, serif", label: "Spectral" },
  { v: "serif", label: "Serif (default)" },
]

const FONT_DEFAULT = "__default__"
const SCALE_OPTIONS = ["Compact", "Default", "Large"] as const

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function TypographySection({ draft, update }: Props) {
  return (
    <details open className="bp-section">
      <summary className="bp-header">
        <ChevronRight className="bp-chevron" />
        <span>Typography</span>
        <span className="ml-auto font-mono text-[10px] font-medium text-muted-foreground">2 fonts</span>
      </summary>
      <div className="bp-body">
        <div className="flex flex-col gap-[5px]">
          <label className="bp-field-label">Sans (UI)</label>
          <select
            className="bp-select"
            value={draft.typography.fontSans ?? FONT_DEFAULT}
            onChange={(e) =>
              update("typography", {
                ...draft.typography,
                fontSans: e.target.value === FONT_DEFAULT ? null : e.target.value,
              })
            }
          >
            <option value={FONT_DEFAULT}>(default)</option>
            {SANS_FONTS.map((f) => (
              <option key={f.v} value={f.v}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label className="bp-field-label">Serif (display)</label>
          <select
            className="bp-select"
            value={draft.typography.fontSerif ?? FONT_DEFAULT}
            onChange={(e) =>
              update("typography", {
                ...draft.typography,
                fontSerif: e.target.value === FONT_DEFAULT ? null : e.target.value,
              })
            }
          >
            <option value={FONT_DEFAULT}>(default)</option>
            {SERIF_FONTS.map((f) => (
              <option key={f.v} value={f.v}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-[5px]">
          <label className="bp-field-label">Type scale</label>
          <div
            className="bp-segmented"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            {SCALE_OPTIONS.map((v) => (
              <button
                key={v}
                type="button"
                className={draft.typography.scale === v.toLowerCase() || (v === "Large" && draft.typography.scale === "relaxed") ? "active" : ""}
                onClick={() =>
                  update("typography", {
                    ...draft.typography,
                    scale: (v === "Large" ? "relaxed" : v.toLowerCase()) as DraftState["typography"]["scale"],
                  })
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </details>
  )
}
