import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  action?: ReactNode;
}

export const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <header className="mb-10 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900 tracking-tight mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-[#64748b] text-[15px]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};
