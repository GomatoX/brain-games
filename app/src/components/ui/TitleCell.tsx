import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type TitleCellProps = {
  icon: ReactNode
  title: string
  subtitle?: string
  className?: string
}

export const TitleCell = ({
  icon,
  title,
  subtitle,
  className,
}: TitleCellProps) => (
  <div className={cn("gtbl-title-cell", className)}>
    <div className="gtbl-glyph">{icon}</div>
    <div className="min-w-0">
      <div className="gtbl-title">{title}</div>
      {subtitle && <div className="gtbl-sub">{subtitle}</div>}
    </div>
  </div>
)
