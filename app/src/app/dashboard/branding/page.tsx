import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { branding } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import BrandingContent from "@/components/BrandingContent"

export default async function BrandingPage() {
  const user = await getAuthenticatedUser()

  const rows = await db
    .select()
    .from(branding)
    .where(eq(branding.orgId, user.orgId))
    .orderBy(desc(branding.createdAt))

  const initialPresets = rows.map((p) => ({
    id: p.id,
    name: p.name,
    tokens: p.tokens ?? null,
    typography: p.typography ?? null,
    logoPath: p.logoPath ?? null,
  }))

  return <BrandingContent initialPresets={initialPresets} />
}
