"use client"
import type { DraftState } from "../BrandingEditor"

export default function DashboardPreview({ draft }: { draft: DraftState }) {
  return (
    <div className="border rounded overflow-hidden" style={{ background: "var(--surface)" }}>
      <header className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        {draft.logoPath ? (
          <img src={`/api/uploads/${draft.logoPath}`} alt="" className="h-8" />
        ) : (
          <div className="font-bold text-lg" style={{ color: "var(--primary)" }}>Brand</div>
        )}
        <div className="ml-auto text-sm">user@example.com</div>
      </header>
      <div className="flex">
        <aside className="w-48 p-4 border-r" style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}>
          <ul className="space-y-2 text-sm">
            <li className="px-2 py-1 rounded" style={{ background: "var(--sidebar-active-bg)", color: "var(--sidebar-active)" }}>Dashboard</li>
            <li className="px-2 py-1">Games</li>
            <li className="px-2 py-1">Settings</li>
          </ul>
        </aside>
        <main className="flex-1 p-4">
          <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--text)" }}>Welcome back</h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Recent activity and quick actions.</p>
          <div className="border rounded p-4 mb-3" style={{ borderColor: "var(--border)" }}>
            <h3 className="font-semibold mb-2">Card title</h3>
            <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>Some descriptive content.</p>
            <button className="px-3 py-1 rounded text-white" style={{ background: "var(--primary)" }}>Primary action</button>
            <button className="ml-2 px-3 py-1 rounded border" style={{ borderColor: "var(--border)" }}>Secondary</button>
          </div>
          <input className="border rounded px-2 py-1 w-full" style={{ borderColor: "var(--border)" }} placeholder="Search…" />
        </main>
      </div>
    </div>
  )
}
