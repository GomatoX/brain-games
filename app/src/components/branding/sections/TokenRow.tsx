"use client"
import { RotateCcw } from "lucide-react"
import type { TokenDef } from "@/lib/branding/token-registry"

type Props = {
  token: TokenDef
  value: string
  isPinned: boolean
  onPin: (value: string) => void
  onReset: () => void
  onChange: (next: string) => void
  onHover?: (id: string | null) => void
}

export default function TokenRow({
  token, value, isPinned, onPin, onReset, onChange, onHover,
}: Props) {
  const handleChange = (v: string) => {
    if (isPinned) {
      onChange(v)
    } else {
      onPin(v)
    }
  }

  return (
    <div
      className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 transition-colors hover:border-foreground/20"
      onMouseEnter={() => onHover?.(token.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(token.id)}
      onBlur={() => onHover?.(null)}
    >
      <div className="relative h-[22px] w-[22px] shrink-0 overflow-hidden rounded-[5px] border border-black/10">
        <input
          type="color"
          aria-label={`${token.label} color`}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer border-none opacity-0"
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[4px]"
          style={{ background: value }}
        />
      </div>
      <span className="text-[11px] font-medium text-foreground/70 shrink-0">
        {token.label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="min-w-0 flex-1 border-none bg-transparent font-mono text-xs lowercase text-foreground outline-none"
        aria-label={`${token.label} hex value`}
      />
      {isPinned && (
        <button
          type="button"
          onClick={onReset}
          className="grid h-5 w-5 shrink-0 place-items-center rounded text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Reset ${token.label} to derived value`}
          title="Reset to auto-derived value"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
