import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[72px] w-full rounded-[var(--ctl-radius)] border border-[var(--tool-border)] bg-[var(--tool-surface)] px-[11px] py-[9px] text-[13px] text-[var(--tool-text)] leading-[1.5] transition-[border-color,box-shadow] duration-[120ms] outline-none placeholder:text-[var(--tool-text-faint)] hover:border-[var(--tool-border-strong)] focus-visible:border-[var(--tool-accent)] focus-visible:ring-[3px] focus-visible:ring-[var(--tool-focus)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 font-[inherit] resize-y",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
