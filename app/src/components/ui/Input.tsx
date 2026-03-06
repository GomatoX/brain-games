import { forwardRef } from "react";

interface InputProps {
  label?: string;
  id?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      type = "text",
      value,
      onChange,
      placeholder,
      disabled,
      required,
      minLength,
      className = "",
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            className="text-[11px] font-semibold text-[#64748b] uppercase tracking-[0.04em]"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          className={`w-full h-[42px] rounded-[4px] border border-[#cbd5e1] text-[#0f172a] text-[15px] px-3 placeholder:text-[#94a3b8] focus:border-navy-900 focus:ring-1 focus:ring-navy-900/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-white ${className}`}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
