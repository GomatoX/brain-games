"use client"
import HelpHint from "../fields/HelpHint"
import type { TokenDef } from "@/lib/branding/token-registry"

type Props = {
  token: TokenDef
  /** Resolved colour shown in the swatch (override value if pinned, else derived). */
  value: string
  /** True when the user has pinned an override for this token. */
  isPinned: boolean
  onPin: (value: string) => void
  onReset: () => void
  onChange: (next: string) => void
  onHover?: (id: string | null) => void
}

export default function TokenRow({
  token, value, isPinned, onPin, onReset, onChange, onHover,
}: Props) {
  return (
    <div
      className="flex items-center gap-2 py-1 px-1 rounded hover:bg-slate-50 focus-within:bg-slate-50"
      onMouseEnter={() => onHover?.(token.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(token.id)}
      onBlur={() => onHover?.(null)}
    >
      <span className="inline-block w-4 h-4 border rounded shrink-0" style={{ background: value }} />
      <span className="font-medium truncate text-xs">{token.label}</span>
      <HelpHint text={token.description} />
      <span className="font-mono text-[10px] text-slate-400 ml-auto truncate">{token.id}</span>
      {isPinned ? (
        <>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-6 shrink-0"
          />
          <button
            type="button"
            onClick={onReset}
            className="text-blue-600 shrink-0 text-xs"
          >
            Reset
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onPin(value)}
          className="text-blue-600 shrink-0 text-xs"
        >
          Pin
        </button>
      )}
    </div>
  )
}
