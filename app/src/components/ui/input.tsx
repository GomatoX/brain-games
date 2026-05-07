import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[var(--ctl-h)] w-full min-w-0 rounded-[var(--ctl-radius)] border border-[var(--tool-border)] bg-[var(--tool-surface)] px-[11px] text-[13px] text-[var(--tool-text)] transition-[border-color,box-shadow] duration-[120ms] outline-none placeholder:text-[var(--tool-text-faint)] hover:border-[var(--tool-border-strong)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 font-[inherit]",
        "focus-visible:border-[var(--tool-accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--tool-focus)]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
