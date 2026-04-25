"use client"
import type { DraftState } from "../BrandingEditor"

export default function LoginPreview({ draft }: { draft: DraftState }) {
  return (
    <div className="flex items-center justify-center py-12" style={{ background: "var(--surface)" }}>
      <div
        className="w-80 p-6 rounded border"
        style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}
      >
        {draft.logoPath ? (
          <img src={`/api/uploads/${draft.logoPath}`} alt="" className="h-10 mb-4 mx-auto" />
        ) : (
          <div className="text-center font-bold text-2xl mb-4" style={{ color: "var(--primary)" }}>Brand</div>
        )}
        <div className="space-y-3">
          <input
            placeholder="Email"
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          />
          <input
            placeholder="Password"
            type="password"
            className="w-full border rounded px-3 py-2"
            style={{ borderColor: "var(--border)" }}
          />
          <button
            className="w-full py-2 rounded text-white"
            style={{ background: "var(--primary)" }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}
