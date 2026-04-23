import { ReactNode } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  icon?: string
  children: ReactNode
  size?: "sm" | "md" | "lg"
}

const sizeClass: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "modal-panel--sm",
  md: "modal-panel--md",
  lg: "modal-panel--lg",
}

export const Modal = ({
  open,
  onClose,
  title,
  icon,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null

  return (
    <div className="modal-backdrop">
      <div className={`modal-panel ${sizeClass[size]}`}>
        {title && (
          <div className="modal-header">
            <div className="modal-title">
              {icon && <span className="material-symbols-outlined">{icon}</span>}
              <h2>{title}</h2>
            </div>
            <button onClick={onClose} className="modal-close">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
