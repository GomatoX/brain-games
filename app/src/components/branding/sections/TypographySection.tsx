"use client"
import { ChevronRight } from "lucide-react"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"
import HelpHint from "../fields/HelpHint"

const SANS_FONTS = [
  "Inter, sans-serif", "Roboto, sans-serif", "Open Sans, sans-serif",
  "Lato, sans-serif", "Montserrat, sans-serif", "Poppins, sans-serif",
  "Source Sans Pro, sans-serif", "Nunito, sans-serif", "Work Sans, sans-serif",
  "DM Sans, sans-serif", "Manrope, sans-serif", "system-ui, sans-serif",
]
const SERIF_FONTS = [
  "Playfair Display, serif", "Merriweather, serif", "Lora, serif",
  "PT Serif, serif", "Crimson Text, serif", "EB Garamond, serif",
  "Cormorant Garamond, serif", "Libre Baskerville, serif",
  "Spectral, serif", "serif",
]

const SCALE_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "relaxed", label: "Relaxed" },
]

const SCALE_HELP =
  "Adjusts how big body text and headings render. Compact for dense layouts; Relaxed for showcase pages."

const FONT_DEFAULT = "__default__"

const fontOptions = (fonts: string[]) =>
  [{ value: FONT_DEFAULT, label: "(default)" }, ...fonts.map((f) => ({ value: f, label: f.split(",")[0] }))]

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function TypographySection({ draft, update }: Props) {
  return (
    <details open className="bp-section">
      <summary className="bp-header">
        <ChevronRight className="bp-chevron" />
        Typography
      </summary>
      <div className="bp-body">
        <SelectField
          label="Sans font"
          value={draft.typography.fontSans ?? FONT_DEFAULT}
          options={fontOptions(SANS_FONTS)}
          onChange={(v) => update("typography", { ...draft.typography, fontSans: v === FONT_DEFAULT ? null : v })}
        />
        <SelectField
          label="Serif font"
          value={draft.typography.fontSerif ?? FONT_DEFAULT}
          options={fontOptions(SERIF_FONTS)}
          onChange={(v) => update("typography", { ...draft.typography, fontSerif: v === FONT_DEFAULT ? null : v })}
        />
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <SelectField
              label="Type scale"
              value={draft.typography.scale}
              options={SCALE_OPTIONS}
              onChange={(v) => update("typography", { ...draft.typography, scale: v as DraftState["typography"]["scale"] })}
            />
          </div>
          <div className="self-end pb-2">
            <HelpHint text={SCALE_HELP} />
          </div>
        </div>
      </div>
    </details>
  )
}
