"use client"

type Props = {
  elevation: "flat" | "subtle" | "lifted"
}

export default function CardElevationPreview({ elevation }: Props) {
  const shadow =
    elevation === "flat" ? "none"
    : elevation === "subtle" ? "0 1px 2px rgba(0,0,0,0.08)"
    : "0 4px 12px rgba(0,0,0,0.18)"
  return (
    <span
      style={{
        display: "inline-block",
        width: "2rem",
        height: "1.25rem",
        background: "var(--surface, white)",
        border: "1px solid var(--border, #e5e7eb)",
        borderRadius: "var(--radius-1, 4px)",
        boxShadow: shadow,
      }}
    />
  )
}
