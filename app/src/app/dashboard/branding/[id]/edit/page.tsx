import { notFound } from "next/navigation"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { getAuthenticatedUser } from "@/lib/auth-server"
import BrandingEditor from "@/components/branding/BrandingEditor"

export default async function BrandingEditPage(
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const user = await getAuthenticatedUser()

  const [live] = await db
    .select()
    .from(branding)
    .where(and(eq(branding.id, id), eq(branding.orgId, user.orgId)))
    .limit(1)
  if (!live) notFound()

  const [draft] = await db
    .select()
    .from(brandingDrafts)
    .where(eq(brandingDrafts.brandingId, id))
    .limit(1)

  return <BrandingEditor brandingId={id} live={live} initialDraft={draft ?? null} />
}
