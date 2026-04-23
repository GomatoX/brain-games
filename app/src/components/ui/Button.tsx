import { ReactNode } from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost"

interface ButtonProps {
  variant?: ButtonVariant
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit"
  className?: string
  icon?: string
  size?: "sm" | "md"
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  danger: "btn-danger",
  ghost: "btn-ghost",
}

export const Button = ({
  variant = "primary",
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
  icon,
  size = "md",
}: ButtonProps) => {
  const sizeClass = size === "sm" ? "btn--sm" : "btn--md"
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass[variant]} ${sizeClass} ${className}`.trim()}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      {children}
    </button>
  )
}
