"use client"

type Props = {
  label: string
  /** Upload kind passed to /api/uploads/branding (e.g. "logo", "favicon", "background"). */
  kind: string
  /** Current upload path, relative to /api/uploads/. `null` means no image yet. */
  path: string | null
  onChange: (path: string | null) => void
}

export default function FileUploadField({ label, kind, path, onChange }: Props) {
  async function handleFile(file: File) {
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
    onChange(body.path)
  }

  return (
    <div className="text-sm">
      <div className="mb-1">{label}</div>
      <div className="flex gap-2 items-center">
        {path ? (
          <img
            src={`/api/uploads/${path}`}
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
            const input = e.target
            const f = input.files?.[0]
            if (f) void handleFile(f).finally(() => { input.value = "" })
          }}
        />
        {path && (
          <button
            className="text-xs text-red-600"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  )
}
