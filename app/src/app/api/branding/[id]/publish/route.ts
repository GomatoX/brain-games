import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result as { orgId: string }
  const { id } = await ctx.params

  const [owned] = await db
    .select({ id: branding.id })
    .from(branding)
    .where(and(eq(branding.id, id), eq(branding.orgId, orgId)))
    .limit(1)
  if (!owned) return NextResponse.json({ error: "not found" }, { status: 404 })

  const [draft] = await db
    .select()
    .from(brandingDrafts)
    .where(eq(brandingDrafts.brandingId, id))
    .limit(1)
  if (!draft) {
    return NextResponse.json({ error: "no draft to publish" }, { status: 400 })
  }

  // Atomic copy + delete. Drizzle's better-sqlite3 transaction requires a
  // sync callback (better-sqlite3's transaction wrapper rejects promises).
  // Pass a sync function and call .run() so the queries execute inline.
  const updatedAt = new Date().toISOString()
  db.transaction((tx) => {
    tx
      .update(branding)
      .set({
        tokens: draft.tokens as never,
        typography: draft.typography as never,
        spacing: draft.spacing as never,
        components: draft.components as never,
        logoPath: draft.logoPath,
        logoDarkPath: draft.logoDarkPath,
        faviconPath: draft.faviconPath,
        backgroundPath: draft.backgroundPath,
        ogImagePath: draft.ogImagePath,
        customCssGames: draft.customCssGames,
        updatedAt,
      })
      .where(eq(branding.id, id))
      .run()
    tx.delete(brandingDrafts).where(eq(brandingDrafts.brandingId, id)).run()
  })

  return NextResponse.json({ success: true, updatedAt })
}
