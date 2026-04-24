"use client"

import { ReactNode, useEffect } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  icon?: string
  size?: "sm" | "md" | "lg"
  children: ReactNode
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
}

export const Modal = ({
  open,
  onClose,
  title,
  icon,
  size = "md",
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/40 sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className={`bg-white shadow-xl w-full flex flex-col overflow-hidden sm:my-auto sm:mx-auto sm:max-h-[90vh] sm:rounded-[4px] ${sizeClass[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-4 sm:px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 min-w-0">
              {icon && (
                <span className="material-symbols-outlined text-rust flex-shrink-0">
                  {icon}
                </span>
              )}
              <h2 className="text-lg font-semibold text-[#0f172a] truncate">
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
