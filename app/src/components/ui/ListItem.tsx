import { ReactNode } from "react";

interface ListItemProps {
  children: ReactNode;
  className?: string;
}

export const ListItem = ({ children, className = "" }: ListItemProps) => {
  return (
    <div
      className={`px-6 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors ${className}`}
    >
      {children}
    </div>
  );
};
