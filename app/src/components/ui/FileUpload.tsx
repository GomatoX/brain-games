import { useRef } from "react";
import { Button } from "./button";

interface FileUploadProps {
  label?: string;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview?: string | null;
  onRemove?: () => void;
  changeLabel?: string;
  hint?: string;
}

export const FileUpload = ({
  label,
  accept = "image/png,image/jpeg,image/svg+xml,image/webp",
  onChange,
  preview,
  onRemove,
  changeLabel = "Change Logo",
  hint = "SVG, PNG, or JPG up to 2MB",
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

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
            <img
              src={preview}
              alt="Preview"
              className="h-[120px] max-w-[200px] rounded-[4px] object-contain border border-[#e2e8f0] bg-[#f8fafc] p-2"
            />
            {onRemove && (
              <button
                onClick={onRemove}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Remove"
              >
                ×
              </button>
            )}
          </div>
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            {changeLabel}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="group relative flex flex-col items-center justify-center w-full h-[120px] rounded-[4px] border border-dashed border-[#cbd5e1] bg-[#f8fafc] hover:bg-[#f1f5f9] hover:border-[#94a3b8] transition-all cursor-pointer">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <span className="material-symbols-outlined text-[#94a3b8] text-[24px]">
              cloud_upload
            </span>
            <p className="text-[13px] font-medium text-navy-900">
              Drag & drop or click to upload
            </p>
            <p className="text-[11px] text-[#94a3b8]">{hint}</p>
          </div>
        </div>
      )}
    </div>
  );
};
