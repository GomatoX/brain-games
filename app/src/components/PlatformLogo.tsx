/**
 * Shared platform branding component.
 *
 * Renders the org logo (if uploaded) or falls back to the
 * default icon + platform name text. Used across login,
 * register, invite, and dashboard sidebar.
 */

import { Settings2 } from "lucide-react";

interface PlatformLogoProps {
  /** Platform display name (from config) */
  platformName: string;
  /** Base64 data URI or URL of the org logo (optional) */
  orgLogoUrl?: string | null;
  /** Size variant */
  size?: "sm" | "md";
}

export default function PlatformLogo({
  platformName,
  orgLogoUrl,
  size = "md",
}: PlatformLogoProps) {
  const iconSize = size === "sm" ? "size-6" : "size-8";
  const textSize = size === "sm" ? "text-lg" : "text-xl";
  const imgHeight = size === "sm" ? "h-6" : "h-10";
  const imgMaxWidth = size === "sm" ? "max-w-[140px]" : "max-w-[180px]";

  if (orgLogoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={orgLogoUrl}
        alt={platformName}
        className={`${imgHeight} ${imgMaxWidth} object-contain`}
      />
    );
  }

  return (
    <>
      <Settings2 className={`text-rust ${iconSize}`} />
      <span className={`${textSize} font-bold font-serif text-[#0f172a]`}>
        {platformName}
      </span>
    </>
  );
}
