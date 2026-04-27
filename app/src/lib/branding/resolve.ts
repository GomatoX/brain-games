import "server-only"
import { db } from "@/db"
import { branding, organizations, users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { deriveTokens } from "./derive"
import {
  TYPOGRAPHY_VARS,
  SCALE_VARS,
  DENSITY_VARS,
  radiusVars,
} from "./css-vars"
import { TOKEN_REGISTRY } from "./token-registry"
import type { BrandingTokens, BrandingTypography, BrandingSpacing } from "./tokens"
import {
  PLATFORM_DEFAULT_TOKENS,
  PLATFORM_DEFAULT_TYPOGRAPHY,
  PLATFORM_DEFAULT_SPACING,
  BRAND_DEFAULT_PRIMARY,
} from "./defaults"

// The PLATFORM_ACCENT env var still wins at runtime — copy the frozen default
// into a fresh object here so we can override `primary` without mutating the
// shared frozen constant.
const RUNTIME_DEFAULT_TOKENS = {
  ...PLATFORM_DEFAULT_TOKENS,
  primary: process.env.PLATFORM_ACCENT || BRAND_DEFAULT_PRIMARY,
  overrides: {},
}

const PLATFORM_DEFAULT_CSS_VARS = tokensToCssVars(
  RUNTIME_DEFAULT_TOKENS,
  PLATFORM_DEFAULT_TYPOGRAPHY,
  PLATFORM_DEFAULT_SPACING,
)

export async function resolveBrandForUser(userId: string, orgId: string): Promise<{
  cssVars: Record<string, string>
  orgId: string
}> {
  const [user] = await db
    .select({ usePlatformChrome: users.usePlatformChrome })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (user?.usePlatformChrome) {
    return { cssVars: PLATFORM_DEFAULT_CSS_VARS, orgId }
  }

  const [org] = await db
    .select({ defaultBranding: organizations.defaultBranding })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1)

  if (!org?.defaultBranding) {
    return { cssVars: PLATFORM_DEFAULT_CSS_VARS, orgId }
  }

  const [b] = await db
    .select()
    .from(branding)
    .where(eq(branding.id, org.defaultBranding))
    .limit(1)

  if (!b?.tokens) {
    return { cssVars: PLATFORM_DEFAULT_CSS_VARS, orgId }
  }

  return {
    cssVars: tokensToCssVars(
      b.tokens as BrandingTokens,
      (b.typography as BrandingTypography) ?? PLATFORM_DEFAULT_TYPOGRAPHY,
      (b.spacing as BrandingSpacing) ?? PLATFORM_DEFAULT_SPACING,
    ),
    orgId,
  }
}

function tokensToCssVars(
  tokens: BrandingTokens,
  typography: BrandingTypography,
  spacing: BrandingSpacing,
): Record<string, string> {
  const derived = deriveTokens(tokens)
  const out: Record<string, string> = {}
  for (const t of TOKEN_REGISTRY) {
    const v = derived[t.id]
    if (!v) continue
    for (const cssVar of t.cssVars) out[cssVar] = v
  }
  if (typography.fontSans) out[TYPOGRAPHY_VARS.fontSans] = typography.fontSans
  if (typography.fontSerif) out[TYPOGRAPHY_VARS.fontSerif] = typography.fontSerif
  Object.assign(out, SCALE_VARS[typography.scale])
  Object.assign(out, DENSITY_VARS[spacing.density])
  Object.assign(out, radiusVars(spacing.radius))
  return out
}
