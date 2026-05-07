"use client"

import type { ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type ModalTab = {
  id: string
  label: string
  step?: number
  icon?: ReactNode
}

type ModalShellProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  tabs?: ModalTab[]
  activeTab?: string
  onTabChange?: (tabId: string) => void
  footer?: ReactNode
  children: ReactNode
  wide?: boolean
  saving?: boolean
  className?: string
}

export const ModalShell = ({
  open,
  onClose,
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  footer,
  children,
  wide = true,
  saving = false,
  className,
}: ModalShellProps) => (
  <Dialog
    open={open}
    onOpenChange={(isOpen) => {
      if (!isOpen && !saving) onClose()
    }}
  >
    <DialogContent
      className={cn(
        "max-h-[90vh] flex flex-col overflow-hidden p-0",
        wide ? "sm:max-w-[720px]" : "sm:max-w-lg",
        className,
      )}
      showCloseButton={false}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-[18px] pb-[14px] flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <DialogHeader className="p-0">
            <DialogTitle className="text-base font-semibold tracking-[-0.005em] mb-1">
              {title}
            </DialogTitle>
          </DialogHeader>
          {subtitle && (
            <p className="text-sm text-muted-foreground m-0">
              {subtitle}
            </p>
          )}
        </div>
        <button
          type="button"
          className="modal-close mt-0.5"
          onClick={onClose}
          aria-label="Close"
          tabIndex={0}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
          >
            <path d="M2 2l8 8M10 2l-8 8" />
          </svg>
        </button>
      </div>

      {/* ── Tabs ── */}
      {tabs && tabs.length > 0 && (
        <div className="modal-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn("modal-tab", activeTab === tab.id && "active")}
              onClick={() => onTabChange?.(tab.id)}
              tabIndex={0}
              aria-label={tab.label}
            >
              {tab.icon ? (
                <span className="step-num">{tab.icon}</span>
              ) : tab.step != null ? (
                <span className="step-num">{tab.step}</span>
              ) : null}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <div className="modal-body-grid flex-1 overflow-y-auto">{children}</div>

      {/* ── Footer ── */}
      {footer && <div className="modal-foot">{footer}</div>}
    </DialogContent>
  </Dialog>
)
