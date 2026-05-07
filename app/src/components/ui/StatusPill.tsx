import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusValue = "published" | "draft" | "scheduled"

const STATUS_CONFIG: Record<StatusValue, { variant: "success" | "warning" | "scheduled"; label: string; dotColor: string }> = {
  published: { variant: "success", label: "Published", dotColor: "bg-emerald-600" },
  draft: { variant: "warning", label: "Draft", dotColor: "bg-amber-600" },
  scheduled: { variant: "scheduled", label: "Scheduled", dotColor: "bg-purple-600" },
}

type StatusPillProps = {
  status: string
  onClick?: () => void
  className?: string
  title?: string
}

export const StatusPill = ({
  status,
  onClick,
  className,
  title,
}: StatusPillProps) => {
  const { variant, label, dotColor } =
    STATUS_CONFIG[status as StatusValue] ?? STATUS_CONFIG.draft

  const content = (
    <>
      <span className={cn("size-1.5 rounded-full", dotColor)} />
      {label}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        tabIndex={0}
        aria-label={title}
        className="inline-flex"
      >
        <Badge variant={variant} className={cn("cursor-pointer gap-1.5", className)}>
          {content}
        </Badge>
      </button>
    )
  }

  return (
    <Badge variant={variant} className={cn("gap-1.5", className)}>
      {content}
    </Badge>
  )
}
