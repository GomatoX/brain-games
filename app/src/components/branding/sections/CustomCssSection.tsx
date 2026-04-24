"use client"
import type { DraftState } from "../BrandingEditor"

const MAX_CSS_BYTES = 16 * 1024

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function CustomCssSection({ draft, update }: Props) {
  const value = draft.customCssGames ?? ""
  return (
    <details className="mb-4">
      <summary className="font-semibold cursor-pointer">Custom CSS (games only)</summary>
      <div className="mt-3 space-y-2">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          CSS injected into game embeds. Auto-scoped to your org.
          Max {MAX_CSS_BYTES.toLocaleString()} bytes.
        </p>
        <textarea
          className="w-full font-mono text-xs border rounded p-2"
          rows={10}
          value={value}
          onChange={(e) => update("customCssGames", e.target.value)}
        />
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {value.length} / {MAX_CSS_BYTES} bytes
        </div>
      </div>
    </details>
  )
}
