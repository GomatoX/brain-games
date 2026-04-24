"use client"
import type { DraftState } from "../BrandingEditor"

type Props = {
  draft: DraftState
  update: <K extends keyof DraftState>(key: K, val: DraftState[K]) => void
}

const FIELDS: { key: keyof DraftState; label: string; kind: string }[] = [
  { key: "logoPath", label: "Logo (light)", kind: "logo" },
  { key: "logoDarkPath", label: "Logo (dark)", kind: "logo-dark" },
  { key: "faviconPath", label: "Favicon", kind: "favicon" },
]

export default function IdentitySection({ draft, update }: Props) {
  async function handleFile(field: keyof DraftState, kind: string, file: File) {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("kind", kind)
    const res = await fetch("/api/uploads/branding", { method: "POST", body: fd })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      window.alert(`Upload failed: ${body.error ?? res.status}`)
      return
    }
    const body = (await res.json()) as { path: string }
    update(field, body.path as never)
  }

  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Identity</summary>
      <div className="mt-3 space-y-3">
        {FIELDS.map(({ key, label, kind }) => (
          <div key={key as string} className="text-sm">
            <div className="mb-1">{label}</div>
            <div className="flex gap-2 items-center">
              {draft[key] ? (
                <img
                  src={`/api/uploads/${draft[key] as string}`}
                  alt={label}
                  className="h-10 border rounded bg-white"
                />
              ) : (
                <span style={{ color: "var(--text-muted)" }}>No image</span>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void handleFile(key, kind, f)
                }}
              />
              {draft[key] && (
                <button
                  className="text-xs text-red-600"
                  onClick={() => update(key, null as never)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </details>
  )
}
