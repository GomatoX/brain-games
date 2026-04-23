import { forwardRef } from "react"

interface InputProps {
  label?: string
  id?: string
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  minLength?: number
  className?: string
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
  ) => (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
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
        className={`input ${className}`.trim()}
      />
    </div>
  ),
)

Input.displayName = "Input"
