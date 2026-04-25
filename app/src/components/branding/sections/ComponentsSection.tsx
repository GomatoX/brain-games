"use client"
import type { DraftState } from "../BrandingEditor"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function ComponentsSection({ draft, update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Components</summary>
      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="block mb-1">Button variant</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.components.button.variant}
            onChange={(e) =>
              update("components", {
                ...draft.components,
                button: {
                  ...draft.components.button,
                  variant: e.target.value as DraftState["components"]["button"]["variant"],
                },
              })
            }
          >
            <option value="solid">Solid</option>
            <option value="outline">Outline</option>
            <option value="ghost-fill">Ghost-fill</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Button shadow</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.components.button.shadow}
            onChange={(e) =>
              update("components", {
                ...draft.components,
                button: {
                  ...draft.components.button,
                  shadow: e.target.value as DraftState["components"]["button"]["shadow"],
                },
              })
            }
          >
            <option value="none">None</option>
            <option value="subtle">Subtle</option>
            <option value="pronounced">Pronounced</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Input variant</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.components.input.variant}
            onChange={(e) =>
              update("components", {
                ...draft.components,
                input: {
                  variant: e.target.value as DraftState["components"]["input"]["variant"],
                },
              })
            }
          >
            <option value="outlined">Outlined</option>
            <option value="filled">Filled</option>
            <option value="underlined">Underlined</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="block mb-1">Card elevation</span>
          <select
            className="border rounded px-2 py-1 w-full"
            value={draft.components.card.elevation}
            onChange={(e) =>
              update("components", {
                ...draft.components,
                card: {
                  elevation: e.target.value as DraftState["components"]["card"]["elevation"],
                },
              })
            }
          >
            <option value="flat">Flat</option>
            <option value="subtle">Subtle</option>
            <option value="lifted">Lifted</option>
          </select>
        </label>
      </div>
    </details>
  )
}
