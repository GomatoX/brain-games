import { notFound } from "next/navigation"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { getAuthenticatedUser } from "@/lib/auth-server"
import BrandingEditor from "@/components/branding/BrandingEditor"
import { getOrgGameTypes, pickPreviewGameType } from "@/lib/branding/org-game-types"
import type { PreviewGameType } from "@/lib/branding/platform-defaults"

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

  const orgTypes = await getOrgGameTypes(user.orgId)
  // Filter out sudoku here — pickPreviewGameType already skips it, but the
  // button row in GamePreview needs the same exclusion so we don't render
  // a Sudoku button for an engine that doesn't exist yet.
  const availableGameTypes: PreviewGameType[] = (
    ["crossword", "wordgame", "wordsearch"] as const
  ).filter((t) => orgTypes.has(t))
  const defaultGameType = pickPreviewGameType(orgTypes)

  return (
    <BrandingEditor
      brandingId={id}
      live={live}
      initialDraft={draft ?? null}
      availableGameTypes={availableGameTypes}
      defaultGameType={defaultGameType}
    />
  )
}
