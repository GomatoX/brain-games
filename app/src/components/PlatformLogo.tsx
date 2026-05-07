/**
 * Shared platform branding component.
 *
 * Renders the org logo (if uploaded) or falls back to the
 * brand mark + platform name text. Used across login,
 * register, invite, and dashboard sidebar.
 */

interface PlatformLogoProps {
  /** Platform display name (from config) */
  platformName: string
  /** Base64 data URI or URL of the org logo (optional) */
  orgLogoUrl?: string | null
  /** Size variant */
  size?: "sm" | "md"
}

export default function PlatformLogo({
  platformName,
  orgLogoUrl,
  size = "md",
}: PlatformLogoProps) {
  const imgHeight = size === "sm" ? "h-6" : "h-10"
  const imgMaxWidth = size === "sm" ? "max-w-[140px]" : "max-w-[180px]"

  if (orgLogoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={orgLogoUrl}
        alt={platformName}
        className={`${imgHeight} ${imgMaxWidth} object-contain`}
      />
    )
  }

  /* Fallback: brand mark square + platform name */
  const markSize = size === "sm" ? "w-[22px] h-[22px] text-[11px]" : "w-[28px] h-[28px] text-[13px]"
  const textSize = size === "sm" ? "text-[14px]" : "text-lg"

  /* Build initials from first 2 words or first 2 characters */
  const words = platformName.trim().split(/\s+/)
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : platformName.slice(0, 2).toUpperCase()

  return (
    <>
      <div
        className={`${markSize} rounded-md grid place-items-center text-white font-bold font-mono flex-shrink-0`}
        style={{ background: "linear-gradient(135deg, var(--tool-accent), color-mix(in srgb, var(--tool-accent) 70%, black))" }}
      >
        {initials}
      </div>
      <span className={`${textSize} font-semibold text-foreground`}>
        {platformName}
      </span>
    </>
  )
}
