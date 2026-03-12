import { ReactNode } from "react";

type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "draft"
  | "scheduled"

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
  outline?: boolean;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const solidStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-slate-100 text-slate-700",
  draft: "bg-slate-100 text-slate-700",
  scheduled: "bg-purple-100 text-purple-800",
}

const outlineStyles: Record<BadgeVariant, string> = {
  success: "border border-emerald-300 text-emerald-700 bg-emerald-50/50",
  warning: "border border-amber-300 text-amber-700 bg-amber-50/50",
  error: "border border-red-300 text-red-700 bg-red-50/50",
  info: "border border-blue-300 text-blue-700 bg-blue-50/50",
  neutral: "border border-slate-300 text-slate-700 bg-slate-50",
  draft: "border border-slate-300 text-slate-700 bg-slate-50",
  scheduled: "border border-purple-300 text-purple-700 bg-purple-50/50",
}

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-600",
  warning: "bg-amber-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  neutral: "bg-slate-500",
  draft: "bg-slate-500",
  scheduled: "bg-purple-600",
}

export const Badge = ({
  variant = "neutral",
  children,
  dot = true,
  outline = false,
  className = "",
  onClick,
  title,
}: BadgeProps) => {
  const styles = outline ? outlineStyles[variant] : solidStyles[variant];
  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] text-[12px] font-semibold tracking-wide ${styles} ${onClick ? "cursor-pointer transition-colors" : ""} ${className}`}
      onClick={onClick}
      title={title}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </Tag>
  );
};
