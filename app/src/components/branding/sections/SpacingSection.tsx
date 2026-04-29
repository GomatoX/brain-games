"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"
import HelpHint from "../fields/HelpHint"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "cozy", label: "Cozy" },
  { value: "comfortable", label: "Comfortable" },
]

const DENSITY_HELP =
  "Controls the breathing room around buttons, cards, and form fields. Compact = tighter; Comfortable = roomier."

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Spacing</summary>
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-1">
          <div className="flex-1">
            <SelectField
              label="Density"
              value={draft.spacing.density}
              options={DENSITY_OPTIONS}
              onChange={(v) =>
                update("spacing", { ...draft.spacing, density: v as DraftState["spacing"]["density"] })
              }
            />
          </div>
          <div className="self-end pb-2">
            <HelpHint text={DENSITY_HELP} />
          </div>
        </div>
        <div className="block text-sm">
          <Label className="block mb-1" htmlFor="branding-radius">
            Corner radius: {draft.spacing.radius} px
          </Label>
          <Slider
            id="branding-radius"
            aria-label="Corner radius"
            min={0}
            max={24}
            step={1}
            value={[draft.spacing.radius]}
            onValueChange={(values) =>
              update("spacing", { ...draft.spacing, radius: values[0] })
            }
            className="w-full"
          />
        </div>
      </div>
    </details>
  )
}
