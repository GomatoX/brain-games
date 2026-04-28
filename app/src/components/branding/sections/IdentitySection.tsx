"use client"
import type { DraftState } from "../BrandingEditor"
import FileUploadField from "../fields/FileUploadField"

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
  return (
    <details open className="mb-4">
      <summary className="font-semibold cursor-pointer">Identity</summary>
      <div className="mt-3 space-y-3">
        {FIELDS.map(({ key, label, kind }) => (
          <FileUploadField
            key={key as string}
            label={label}
            kind={kind}
            path={draft[key] as string | null}
            onChange={(p) => update(key, p as never)}
          />
        ))}
      </div>
    </details>
  )
}
