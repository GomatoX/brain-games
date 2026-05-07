import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-[6px] rounded-[6px] text-[13px] font-medium whitespace-nowrap transition-[background,border-color,color] duration-[120ms] outline-none focus-visible:border-[var(--tool-accent)] focus-visible:ring-[3px] focus-visible:ring-[rgba(194,65,12,0.18)] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--tool-accent)] text-white border border-[var(--tool-accent)] hover:bg-[#a8390a] hover:border-[#a8390a]",
        destructive:
          "bg-destructive text-white border border-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-[var(--tool-border)] bg-[var(--tool-surface)] text-[var(--tool-text)] hover:bg-[var(--tool-surface-2)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border border-transparent bg-transparent text-[var(--tool-text-soft)] hover:bg-[var(--tool-surface-2)] hover:text-[var(--tool-text)]",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-rust to-rust-dark text-white border border-transparent hover:shadow-md hover:shadow-rust/20 disabled:opacity-60",
      },
      size: {
        default: "h-[var(--ctl-h)] px-3.5",
        xs: "h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[var(--ctl-h-sm)] gap-[4px] px-2.5 text-[12px]",
        lg: "h-[var(--ctl-h-lg)] px-5",
        icon: "size-[var(--ctl-h)]",
        "icon-xs":
          "size-[30px] rounded-[6px] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm": "size-[var(--ctl-h-sm)]",
        "icon-lg": "size-[var(--ctl-h-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
