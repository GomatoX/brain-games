"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"

const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "cozy", label: "Cozy" },
  { value: "comfortable", label: "Comfortable" },
]

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Spacing</summary>
      <div className="mt-3 space-y-3">
        <SelectField
          label="Density"
          value={draft.spacing.density}
          options={DENSITY_OPTIONS}
          onChange={(v) => update("spacing", { ...draft.spacing, density: v as DraftState["spacing"]["density"] })}
        />
        <label className="block text-sm">
          <span className="block mb-1">Radius (px): {draft.spacing.radius}</span>
          <input
            type="range"
            min={0}
            max={24}
            value={draft.spacing.radius}
            onChange={(e) =>
              update("spacing", { ...draft.spacing, radius: Number(e.target.value) })
            }
            className="w-full"
          />
        </label>
      </div>
    </details>
  )
}
