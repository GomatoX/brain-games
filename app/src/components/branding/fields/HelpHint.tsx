"use client"

type Props = {
  text: string
}

export default function HelpHint({ text }: Props) {
  return (
    <span
      role="img"
      aria-label={text}
      title={text}
      className="inline-block shrink-0 text-slate-400 cursor-help select-none"
    >
      ⓘ
    </span>
  )
}
