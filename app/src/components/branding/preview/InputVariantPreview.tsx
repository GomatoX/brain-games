"use client"

type Props = {
  variant: "outlined" | "filled" | "underlined"
}

export default function InputVariantPreview({ variant }: Props) {
  const base = {
    display: "inline-block",
    width: "2.5rem",
    height: "1.25rem",
  } as const
  if (variant === "outlined") {
    return <span style={{ ...base, border: "1px solid var(--border, #e5e7eb)", borderRadius: "var(--radius-1, 4px)", background: "transparent" }} />
  }
  if (variant === "filled") {
    return <span style={{ ...base, border: "1px solid transparent", borderRadius: "var(--radius-1, 4px)", background: "var(--surface-2, #f3f4f6)" }} />
  }
  // underlined
  return <span style={{ ...base, borderBottom: "1px solid var(--border, #6b7280)", background: "transparent" }} />
}
