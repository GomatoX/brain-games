"use client"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

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

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("kind", kind)
      const res = await fetch("/api/uploads/branding", { method: "POST", body: fd })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(`Upload failed: ${body.error ?? res.status}`)
        return
      }
      const body = (await res.json()) as { path: string }
      onChange(body.path)
    } finally {
      setUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
    disabled: uploading,
    noClick: false,
    onDrop: (accepted) => {
      const f = accepted[0]
      if (f) void handleFile(f)
    },
  })

  return (
    <div className="text-sm">
      <div className="mb-1">{label}</div>
      <div
        {...getRootProps()}
        data-testid="file-upload-dropzone"
        className={
          "flex gap-3 items-center p-3 border-2 rounded transition cursor-pointer " +
          (isDragActive
            ? "border-primary bg-accent"
            : "border-dashed border-input hover:border-ring")
        }
      >
        <input {...getInputProps()} />
        {path ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/uploads/${path}`}
            alt={label}
            className="h-16 max-w-[8rem] object-contain border rounded bg-background"
          />
        ) : (
          <span className="flex-1 text-muted-foreground">
            Drop an image here, or click to choose
          </span>
        )}
        {uploading && (
          <span className="text-xs text-muted-foreground">Uploading…</span>
        )}
        {path && !uploading && (
          <Button
            type="button"
            variant="link"
            size="sm"
            className="text-destructive h-auto p-0"
            onClick={(e) => {
              // The dropzone root would re-open the file dialog otherwise.
              e.stopPropagation()
              onChange(null)
            }}
          >
            Remove
          </Button>
        )}
        {!path && !uploading && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              open()
            }}
          >
            Choose file
          </Button>
        )}
      </div>
    </div>
  )
}
