"use client"
import type { DraftState } from "../BrandingEditor"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Spacing</summary>
      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="block mb-1">Density</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.spacing.density}
            onChange={(e) =>
              update("spacing", {
                ...draft.spacing,
                density: e.target.value as DraftState["spacing"]["density"],
              })
            }
          >
            <option value="compact">Compact</option>
            <option value="cozy">Cozy</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </label>
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
