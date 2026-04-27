import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import BrandingContent from "@/components/BrandingContent"
import { getBrandingUsageCounts } from "@/lib/branding/usage"

export default async function BrandingPage() {
  const user = await getAuthenticatedUser()

  const [rows, usageCounts] = await Promise.all([
    db
      .select({
        id: branding.id,
        name: branding.name,
        tokens: branding.tokens,
        typography: branding.typography,
        logoPath: branding.logoPath,
        updatedAt: branding.updatedAt,
        draftUpdatedAt: brandingDrafts.updatedAt,
      })
      .from(branding)
      .leftJoin(brandingDrafts, eq(brandingDrafts.brandingId, branding.id))
      .where(eq(branding.orgId, user.orgId))
      .orderBy(desc(branding.createdAt)),
    getBrandingUsageCounts(user.orgId),
  ])

  const initialPresets = rows.map((p) => ({
    id: p.id,
    name: p.name,
    tokens: p.tokens ?? null,
    typography: p.typography ?? null,
    logoPath: p.logoPath ?? null,
    updatedAt: p.updatedAt,
    hasDraft: p.draftUpdatedAt != null,
    lastEditedAt: p.draftUpdatedAt ?? p.updatedAt,
    usageCount: usageCounts.get(p.id) ?? 0,
  }))

  return <BrandingContent initialPresets={initialPresets} />
}
