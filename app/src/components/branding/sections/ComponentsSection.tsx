"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"

const BUTTON_VARIANT = [
  { value: "solid", label: "Solid" },
  { value: "outline", label: "Outline" },
  { value: "ghost-fill", label: "Ghost-fill" },
]
const BUTTON_SHADOW = [
  { value: "none", label: "None" },
  { value: "subtle", label: "Subtle" },
  { value: "pronounced", label: "Pronounced" },
]
const INPUT_VARIANT = [
  { value: "outlined", label: "Outlined" },
  { value: "filled", label: "Filled" },
  { value: "underlined", label: "Underlined" },
]
const CARD_ELEVATION = [
  { value: "flat", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "lifted", label: "Lifted" },
]

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function ComponentsSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Components</summary>
      <div className="mt-3 space-y-3">
        <SelectField
          label="Button variant"
          value={draft.components.button.variant}
          options={BUTTON_VARIANT}
          onChange={(v) => update("components", {
            ...draft.components,
            button: { ...draft.components.button, variant: v as DraftState["components"]["button"]["variant"] },
          })}
        />
        <SelectField
          label="Button shadow"
          value={draft.components.button.shadow}
          options={BUTTON_SHADOW}
          onChange={(v) => update("components", {
            ...draft.components,
            button: { ...draft.components.button, shadow: v as DraftState["components"]["button"]["shadow"] },
          })}
        />
        <SelectField
          label="Input variant"
          value={draft.components.input.variant}
          options={INPUT_VARIANT}
          onChange={(v) => update("components", {
            ...draft.components,
            input: { variant: v as DraftState["components"]["input"]["variant"] },
          })}
        />
        <SelectField
          label="Card elevation"
          value={draft.components.card.elevation}
          options={CARD_ELEVATION}
          onChange={(v) => update("components", {
            ...draft.components,
            card: { elevation: v as DraftState["components"]["card"]["elevation"] },
          })}
        />
      </div>
    </details>
  )
}
