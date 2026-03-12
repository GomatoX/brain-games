/**
 * Platform configuration — read from runtime env vars.
 *
 * These are regular `process.env` vars (not NEXT_PUBLIC_),
 * so they are resolved at runtime on the server.
 * One Docker image can serve any client by setting these env vars.
 */
export const platformConfig = {
  /** "saas" = full landing + dashboard, "whitelabel" = dashboard only */
  mode: process.env.PLATFORM_MODE || "saas",

  /** Platform display name (sidebar, login, title) */
  name: process.env.PLATFORM_NAME || "Rustycogs.io",

  /** Platform URL (used in "Powered by" links, landing page examples, etc.) */
  url: process.env.PLATFORM_URL || "https://rustycogs.io",

  /** Optional custom logo path */
  logo: process.env.PLATFORM_LOGO || "",

  /** Primary accent color (CSS hex) */
  accent: process.env.PLATFORM_ACCENT || "#c25e40",

  /** Whether to hide the marketing landing page */
  hideLanding: process.env.HIDE_LANDING === "true",

  /** Whether to hide self-registration */
  hideRegister: process.env.HIDE_REGISTER === "true",

  /**
   * IP allowlist (comma-separated).
   * When set, only these IPs can access login, dashboard, and play pages.
   * API routes remain open so game embeds work from any domain.
   * Example: "1.2.3.4,5.6.7.8"
   */
  allowedIps: (process.env.ALLOWED_IPS || "")
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean),
}

/** Helper: is this a white-label deployment? */
export function isWhiteLabel() {
  return platformConfig.mode === "whitelabel";
}

/**
 * Config subset safe to pass as props to client components.
 * Call this from server components/layouts and spread into client component props.
 */
export function getClientConfig() {
  return {
    platformName: platformConfig.name,
    platformUrl: platformConfig.url,
    platformAccent: platformConfig.accent,
    platformLogo: platformConfig.logo,
    isWhiteLabel: isWhiteLabel(),
    hideRegister: platformConfig.hideRegister || isWhiteLabel(),
  };
}
