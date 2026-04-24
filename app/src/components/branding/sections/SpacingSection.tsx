"use client"
import type { DraftState } from "../BrandingEditor"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

export default function SpacingSection({ draft: _draft, update: _update }: Props) {
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Spacing</summary>
      <div className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Stub — implementation in Task 21.
      </div>
    </details>
  )
}
