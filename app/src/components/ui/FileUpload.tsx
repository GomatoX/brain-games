import { useDropzone } from "react-dropzone"
import { UploadCloud, X } from "lucide-react"
import { Button } from "./button"

interface FileUploadProps {
  label?: string
  accept?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  preview?: string | null
  onRemove?: () => void
  changeLabel?: string
  hint?: string
}

const DEFAULT_ACCEPT = "image/png,image/jpeg,image/svg+xml,image/webp"

export const FileUpload = ({
  label,
  accept = DEFAULT_ACCEPT,
  onChange,
  preview,
  onRemove,
  changeLabel = "Change Logo",
  hint = "SVG, PNG, or JPG up to 2MB",
}: FileUploadProps) => {
  // Convert the comma-separated MIME string into the object form react-dropzone wants.
  const acceptMap: Record<string, string[]> = {}
  for (const mime of accept.split(",").map((s) => s.trim()).filter(Boolean)) {
    acceptMap[mime] = []
  }

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: acceptMap,
    multiple: false,
    noClick: !!preview, // when there's a preview, the user clicks "Change Logo" instead
    onDrop: (accepted) => {
      const f = accepted[0]
      if (!f || !onChange) return
      // Adapt to the existing onChange contract (an input ChangeEvent).
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(f)
      const fakeInput = document.createElement("input")
      fakeInput.type = "file"
      fakeInput.files = dataTransfer.files
      const event = {
        target: fakeInput,
        currentTarget: fakeInput,
      } as unknown as React.ChangeEvent<HTMLInputElement>
      onChange(event)
    },
  })

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.04em]">
          {label}
        </span>
      )}
      {preview ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="h-[120px] max-w-[200px] rounded-[4px] object-contain border border-[#e2e8f0] bg-[#f8fafc] p-2"
            />
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                aria-label="Remove"
                title="Remove"
                className="absolute -top-2 -right-2 size-5 rounded-full p-0"
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
          <Button type="button" variant="outline" onClick={() => open()}>
            {changeLabel}
          </Button>
          {/* hidden native input retained so callers depending on event semantics still work */}
          <input {...getInputProps()} />
        </div>
      ) : (
        <div
          {...getRootProps()}
          className="group relative flex flex-col items-center justify-center w-full h-[120px] rounded-[4px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#94a3b8] transition-all cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <UploadCloud className="text-[#94a3b8] size-6" />
            <p className="text-[13px] font-medium text-navy-900">
              Drag &amp; drop or click to upload
            </p>
            <p className="text-[11px] text-[#94a3b8]">{hint}</p>
          </div>
        </div>
      )}
    </div>
  )
}
