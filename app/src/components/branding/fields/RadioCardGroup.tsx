"use client"
import type { ReactNode, KeyboardEvent } from "react"

export type RadioCardOption = {
  value: string
  label: string
  preview: ReactNode
}

type Props = {
  label: string
  value: string
  options: RadioCardOption[]
  onChange: (value: string) => void
}

const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown"])
const PREV_KEYS = new Set(["ArrowLeft", "ArrowUp"])

export default function RadioCardGroup({ label, value, options, onChange }: Props) {
  const handleKey = (option: RadioCardOption, index: number) =>
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        onChange(option.value)
        return
      }
      if (NEXT_KEYS.has(e.key)) {
        e.preventDefault()
        const next = options[(index + 1) % options.length]
        onChange(next.value)
        return
      }
      if (PREV_KEYS.has(e.key)) {
        e.preventDefault()
        const prev = options[(index - 1 + options.length) % options.length]
        onChange(prev.value)
        return
      }
    }

  return (
    <div className="block text-sm">
      <div className="mb-1">{label}</div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-2">
        {options.map((o, i) => {
          const selected = o.value === value
          return (
            <div
              key={o.value}
              role="radio"
              aria-checked={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange(o.value)}
              onKeyDown={handleKey(o, i)}
              className={
                "flex flex-col items-stretch gap-1 p-2 border rounded cursor-pointer transition " +
                (selected ? "border-slate-800 bg-slate-50" : "border-slate-200 hover:border-slate-400")
              }
            >
              <div className="flex items-center justify-center h-12 bg-white rounded border border-dashed border-slate-200">
                {o.preview}
              </div>
              <div className="text-center text-xs">{o.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
