"use client"
import { useState, type DragEvent } from "react"

type Props = {
  label: string
  /** Upload kind passed to /api/uploads/branding (e.g. "logo", "favicon", "background"). */
  kind: string
  /** Current upload path, relative to /api/uploads/. `null` means no image yet. */
  path: string | null
  onChange: (path: string | null) => void
}

export default function FileUploadField({ label, kind, path, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
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
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) void handleFile(f)
  }

  return (
    <div className="text-sm">
      <div className="mb-1">{label}</div>
      <div
        data-testid="file-upload-dropzone"
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={
          "flex gap-3 items-center p-3 border-2 rounded transition " +
          (dragging
            ? "border-blue-400 bg-blue-50"
            : "border-dashed border-slate-300 hover:border-slate-400")
        }
      >
        {path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/uploads/${path}`}
            alt={label}
            className="h-16 max-w-[8rem] object-contain border rounded bg-white"
          />
        ) : (
          <span style={{ color: "var(--text-muted)" }} className="flex-1">
            Drop an image here, or
          </span>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          disabled={uploading}
          onChange={(e) => {
            const input = e.target
            const f = input.files?.[0]
            if (f) void handleFile(f).finally(() => { input.value = "" })
          }}
        />
        {uploading && (
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Uploading…</span>
        )}
        {path && !uploading && (
          <button
            type="button"
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
