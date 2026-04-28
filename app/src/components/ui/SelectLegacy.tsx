interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  id?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

export const Select = ({
  label,
  id,
  value,
  onChange,
  options,
  disabled,
  className = "",
}: SelectProps) => {
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
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-[42px] rounded-[4px] border border-[#cbd5e1] text-[#0f172a] text-[15px] px-3 appearance-none pr-10 cursor-pointer focus:border-navy-900 focus:ring-1 focus:ring-navy-900/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed bg-white ${className}`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined text-[#94a3b8] text-[18px] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          expand_more
        </span>
      </div>
    </div>
  );
};
