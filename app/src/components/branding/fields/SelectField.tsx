"use client"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SelectOption = { value: string; label: string }

type Props = {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  /** Optional placeholder shown when value === "". */
  placeholder?: string
}

export default function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder,
}: Props) {
  // shadcn Select disallows empty-string values for items; map "" → undefined
  // for the controlled value so the placeholder shows.
  const selectValue = value === "" ? undefined : value
  return (
    <div className="block text-sm">
      <Label className="block mb-1">{label}</Label>
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
