"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"

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

const fontOptions = (fonts: string[]) =>
  [{ value: "", label: "(default)" }, ...fonts.map((f) => ({ value: f, label: f.split(",")[0] }))]

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function TypographySection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Typography</summary>
      <div className="mt-3 space-y-3">
        <SelectField
          label="Sans font"
          value={draft.typography.fontSans ?? ""}
          options={fontOptions(SANS_FONTS)}
          onChange={(v) => update("typography", { ...draft.typography, fontSans: v || null })}
        />
        <SelectField
          label="Serif font"
          value={draft.typography.fontSerif ?? ""}
          options={fontOptions(SERIF_FONTS)}
          onChange={(v) => update("typography", { ...draft.typography, fontSerif: v || null })}
        />
        <SelectField
          label="Scale"
          value={draft.typography.scale}
          options={SCALE_OPTIONS}
          onChange={(v) => update("typography", { ...draft.typography, scale: v as DraftState["typography"]["scale"] })}
        />
      </div>
    </details>
  )
}
