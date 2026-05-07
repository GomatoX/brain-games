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
      className="bp-token-row"
      onMouseEnter={() => onHover?.(token.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(token.id)}
      onBlur={() => onHover?.(null)}
    >
      <span className="bp-token-swatch" style={{ background: value }} />
      <span className="bp-token-label">{token.label}</span>
      <HelpHint text={token.description} />
      <span className="bp-token-id">{token.id}</span>
      {isPinned ? (
        <>
          <input
            type="color"
            aria-label={`${token.label} color`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bp-swatch !w-5 !h-5"
          />
          <button
            type="button"
            onClick={onReset}
            className="text-[10px] text-[var(--tool-accent)] hover:underline shrink-0"
            aria-label={`Reset ${token.label}`}
            tabIndex={0}
          >
            Reset
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => onPin(value)}
          className="text-[10px] text-[var(--tool-text-faint)] hover:text-[var(--tool-text)] shrink-0"
          aria-label={`Pin ${token.label}`}
          tabIndex={0}
        >
          Pin
        </button>
      )}
    </div>
  )
}
