"use client"
import type { DraftState } from "../BrandingEditor"

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

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function TypographySection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Typography</summary>
      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="block mb-1">Sans font</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.typography.fontSans ?? ""}
            onChange={(e) =>
              update("typography", { ...draft.typography, fontSans: e.target.value || null })
            }
          >
            <option value="">(default)</option>
            {SANS_FONTS.map((f) => <option key={f} value={f}>{f.split(",")[0]}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Serif font</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.typography.fontSerif ?? ""}
            onChange={(e) =>
              update("typography", { ...draft.typography, fontSerif: e.target.value || null })
            }
          >
            <option value="">(default)</option>
            {SERIF_FONTS.map((f) => <option key={f} value={f}>{f.split(",")[0]}</option>)}
          </select>
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Scale</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.typography.scale}
            onChange={(e) =>
              update("typography", {
                ...draft.typography,
                scale: e.target.value as DraftState["typography"]["scale"],
              })
            }
          >
            <option value="compact">Compact</option>
            <option value="default">Default</option>
            <option value="relaxed">Relaxed</option>
          </select>
        </label>
      </div>
    </details>
  )
}
