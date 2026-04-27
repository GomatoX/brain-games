"use client"
import type { DraftState } from "../BrandingEditor"
import SelectField from "../fields/SelectField"
import RadioCardGroup from "../fields/RadioCardGroup"
import ButtonVariantPreview from "../preview/ButtonVariantPreview"
import CardElevationPreview from "../preview/CardElevationPreview"
import InputVariantPreview from "../preview/InputVariantPreview"

const BUTTON_VARIANT = [
  { value: "solid", label: "Solid", preview: <ButtonVariantPreview variant="solid" /> },
  { value: "outline", label: "Outline", preview: <ButtonVariantPreview variant="outline" /> },
  { value: "ghost-fill", label: "Ghost-fill", preview: <ButtonVariantPreview variant="ghost-fill" /> },
]
const BUTTON_ELEVATION = [
  { value: "none", label: "Flat" },
  { value: "subtle", label: "Subtle" },
  { value: "pronounced", label: "Lifted" },
]
const INPUT_VARIANT = [
  { value: "outlined", label: "Outlined", preview: <InputVariantPreview variant="outlined" /> },
  { value: "filled", label: "Filled", preview: <InputVariantPreview variant="filled" /> },
  { value: "underlined", label: "Underlined", preview: <InputVariantPreview variant="underlined" /> },
]
const CARD_ELEVATION = [
  { value: "flat", label: "Flat", preview: <CardElevationPreview elevation="flat" /> },
  { value: "subtle", label: "Subtle", preview: <CardElevationPreview elevation="subtle" /> },
  { value: "lifted", label: "Lifted", preview: <CardElevationPreview elevation="lifted" /> },
]

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function ComponentsSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Components</summary>
      <div className="mt-3 space-y-4">
        <RadioCardGroup
          label="Button variant"
          value={draft.components.button.variant}
          options={BUTTON_VARIANT}
          onChange={(v) => update("components", {
            ...draft.components,
            button: { ...draft.components.button, variant: v as DraftState["components"]["button"]["variant"] },
          })}
        />
        <SelectField
          label="Button elevation"
          value={draft.components.button.shadow}
          options={BUTTON_ELEVATION}
          onChange={(v) => update("components", {
            ...draft.components,
            button: { ...draft.components.button, shadow: v as DraftState["components"]["button"]["shadow"] },
          })}
        />
        <RadioCardGroup
          label="Input variant"
          value={draft.components.input.variant}
          options={INPUT_VARIANT}
          onChange={(v) => update("components", {
            ...draft.components,
            input: { variant: v as DraftState["components"]["input"]["variant"] },
          })}
        />
        <RadioCardGroup
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
