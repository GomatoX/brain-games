import { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

const modalSizes: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export const Modal = ({
  open,
  onClose,
  title,
  icon,
  children,
  size = "md",
}: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className={`bg-white rounded-[4px] w-full ${modalSizes[size]} shadow-xl overflow-hidden max-h-[90vh] flex flex-col`}
      >
        {title && (
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon && (
                <span className="material-symbols-outlined text-navy-900">
                  {icon}
                </span>
              )}
              <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#64748b] hover:text-navy-900 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
