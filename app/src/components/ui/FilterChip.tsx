import { cn } from "@/lib/utils"

type FilterChipProps = {
  label: string
  count: number
  active?: boolean
  onClick: () => void
}

export const FilterChip = ({
  label,
  count,
  active = false,
  onClick,
}: FilterChipProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={active}
    aria-label={`Filter by ${label}`}
    onClick={onClick}
    className={cn(
      "inline-flex items-center h-8 rounded-full px-3 gap-1.5 text-xs font-medium border transition-colors",
      active
        ? "bg-[var(--tool-accent-soft)] text-[var(--tool-accent)] border-[var(--tool-accent)]"
        : "bg-transparent border-border text-muted-foreground hover:bg-muted",
    )}
    tabIndex={0}
  >
    {label}
    <span
      className={cn(
        "font-mono text-[10.5px] px-1.5 rounded-lg",
        active ? "bg-[color-mix(in_srgb,var(--tool-accent)_15%,transparent)]" : "bg-black/5",
      )}
    >
      {count}
    </span>
  </button>
)
