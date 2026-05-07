import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type FieldLabelProps = {
  children: ReactNode
  hint?: string
  htmlFor?: string
  className?: string
}

export const FieldLabel = ({
  children,
  hint,
  htmlFor,
  className,
}: FieldLabelProps) => (
  <label htmlFor={htmlFor} className={cn("field-label", className)}>
    <span>{children}</span>
    {hint && <span className="hint">{hint}</span>}
  </label>
)
