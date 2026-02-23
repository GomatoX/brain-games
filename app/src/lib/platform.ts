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

  /** Optional custom logo path */
  logo: process.env.PLATFORM_LOGO || "",

  /** Primary accent color (CSS hex) */
  accent: process.env.PLATFORM_ACCENT || "#c25e40",

  /** Whether to hide the marketing landing page */
  hideLanding: process.env.HIDE_LANDING === "true",

  /** Whether to hide self-registration */
  hideRegister: process.env.HIDE_REGISTER === "true",
};

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
    platformAccent: platformConfig.accent,
    platformLogo: platformConfig.logo,
    isWhiteLabel: isWhiteLabel(),
  };
}
