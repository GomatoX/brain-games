"use client"
import { useState } from "react"
import type { DraftState } from "./BrandingEditor"

type Tab = "dashboard" | "game" | "login"

export default function BrandingPreviewPane({ draft }: { draft: DraftState }) {
  const [tab, setTab] = useState<Tab>("dashboard")
  return (
    <div className="p-6">
      <nav className="flex gap-2 mb-4">
        {(["dashboard", "game", "login"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 border rounded ${tab === t ? "bg-[var(--primary)] text-white" : ""}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
        Preview for tab &quot;{tab}&quot; — wired in Task 23.
      </div>
      <span className="hidden">{JSON.stringify(draft.tokens.primary)}</span>
    </div>
  )
}
