"use client"

export type SelectOption = { value: string; label: string }

type Props = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Optional disabled placeholder option, shown when `value === ""` */
  placeholder?: string
}

export default function SelectField({ label, value, options, onChange, placeholder }: Props) {
  return (
    <label className="block text-sm">
      <span className="block mb-1">{label}</span>
      <select
        className="border rounded px-2 py-1 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder !== undefined && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  )
}
