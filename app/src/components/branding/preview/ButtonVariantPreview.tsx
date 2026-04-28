"use client"

type Props = {
  variant: "solid" | "outline" | "ghost-fill"
}

export default function ButtonVariantPreview({ variant }: Props) {
  const base = {
    padding: "0.25rem 0.5rem",
    borderRadius: "var(--radius-1, 6px)",
    fontSize: "0.7rem",
  } as const
  if (variant === "solid") {
    return <span style={{ ...base, background: "var(--primary)", color: "var(--primary-contrast, white)" }}>Aa</span>
  }
  if (variant === "outline") {
    return <span style={{ ...base, background: "transparent", color: "var(--primary)", border: "1px solid var(--primary)" }}>Aa</span>
  }
  // ghost-fill
  return <span style={{ ...base, background: "var(--primary-soft, rgba(0,0,0,0.06))", color: "var(--primary)" }}>Aa</span>
}
