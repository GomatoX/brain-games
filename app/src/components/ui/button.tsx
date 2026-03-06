import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  icon?: string;
  size?: "sm" | "md";
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 hover:bg-navy-800 text-white shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-navy-900",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-navy-900 focus:ring-2 focus:ring-offset-1 focus:ring-slate-200",
  outline:
    "bg-white hover:bg-slate-50 border border-[#cbd5e1] text-navy-900 focus:ring-2 focus:ring-offset-1 focus:ring-slate-200",
  danger:
    "bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-offset-1 focus:ring-red-500",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-navy-900",
};

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
  const sizeClass =
    size === "sm" ? "text-[12px] py-1 px-3" : "text-[14px] py-2 px-4";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-medium rounded-[4px] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonStyles[variant]} ${sizeClass} ${className}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-sm">{icon}</span>
      )}
      {children}
    </button>
  );
};
