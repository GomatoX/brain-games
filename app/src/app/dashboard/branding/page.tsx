import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import BrandingContent from "@/components/BrandingContent"

export default async function BrandingPage() {
  const user = await getAuthenticatedUser()

  const rows = await db
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
    .orderBy(desc(branding.createdAt))

  const initialPresets = rows.map((p) => ({
    id: p.id,
    name: p.name,
    tokens: p.tokens ?? null,
    typography: p.typography ?? null,
    logoPath: p.logoPath ?? null,
    updatedAt: p.updatedAt,
    hasDraft: p.draftUpdatedAt != null,
    lastEditedAt: p.draftUpdatedAt ?? p.updatedAt,
  }))

  return <BrandingContent initialPresets={initialPresets} />
}
