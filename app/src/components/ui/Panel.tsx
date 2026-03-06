import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export const Panel = ({ children, className = "" }: PanelProps) => {
  return (
    <div
      className={`bg-white rounded-[4px] shadow-sharp border border-[#e2e8f0] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

interface PanelHeaderProps {
  title: string;
  count?: number | string | ReactNode;
  action?: ReactNode;
}

export const PanelHeader = ({ title, count, action }: PanelHeaderProps) => {
  return (
    <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-3">
      <h2 className="text-[15px] font-semibold text-navy-900">{title}</h2>
      {count !== undefined &&
        (typeof count === "number" || typeof count === "string" ? (
          <span className="text-[11px] font-medium text-[#94a3b8] bg-[#f1f5f9] px-2 py-0.5 rounded-[4px]">
            {count}
          </span>
        ) : (
          count
        ))}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
};
