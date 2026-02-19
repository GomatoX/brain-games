/**
 * Platform configuration for white-label / on-premise deployments.
 * All values are env-driven with sensible defaults for SaaS mode.
 */

export const platformConfig = {
  /** "saas" = full landing + dashboard, "whitelabel" = dashboard only */
  mode: process.env.NEXT_PUBLIC_MODE || "saas",

  /** Platform display name (sidebar, login, title) */
  name: process.env.NEXT_PUBLIC_PLATFORM_NAME || "Rustycogs.io",

  /** Optional custom logo path */
  logo: process.env.NEXT_PUBLIC_PLATFORM_LOGO || "",

  /** Primary accent color (CSS hex) */
  accent: process.env.NEXT_PUBLIC_PLATFORM_ACCENT || "#c25e40", // default #c25e40

  /** Whether to hide the marketing landing page */
  hideLanding: process.env.NEXT_PUBLIC_HIDE_LANDING === "true",

  /** Whether to hide self-registration */
  hideRegister: process.env.NEXT_PUBLIC_HIDE_REGISTER === "true",
};

/** Helper: is this a white-label deployment? */
export function isWhiteLabel() {
  return platformConfig.mode === "whitelabel";
}
