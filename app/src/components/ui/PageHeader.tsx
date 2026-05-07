import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  subtitle?: ReactNode
  /** @deprecated Use `subtitle` instead */
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export const PageHeader = ({
  title,
  subtitle,
  description,
  action,
  className,
}: PageHeaderProps) => {
  const sub = subtitle ?? description

  return (
    <div className={cn("page-head", className)}>
      <div className="min-w-0 flex-1">
        <h1 className="page-title">{title}</h1>
        {sub && (
          <p className="text-sm text-muted-foreground mt-0.5 mb-0">
            {sub}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
