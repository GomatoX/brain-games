import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"
import { sanitizeCss } from "@/lib/branding/sanitize-css"
import { scopeCss } from "@/lib/branding/scope-css"

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result as { orgId: string }
  const { id } = await ctx.params

  const body = (await request.json()) as {
    expectedUpdatedAt?: string
    tokens?: unknown
    typography?: unknown
    spacing?: unknown
    components?: unknown
    logoPath?: string | null
    logoDarkPath?: string | null
    faviconPath?: string | null
    backgroundPath?: string | null
    ogImagePath?: string | null
    customCssGames?: string | null
  }

  // Verify the brand belongs to this org
  const [owned] = await db
    .select({ id: branding.id })
    .from(branding)
    .where(and(eq(branding.id, id), eq(branding.orgId, orgId)))
    .limit(1)
  if (!owned) return NextResponse.json({ error: "not found" }, { status: 404 })

  const [existing] = await db
    .select()
    .from(brandingDrafts)
    .where(eq(brandingDrafts.brandingId, id))
    .limit(1)

  if (existing && body.expectedUpdatedAt && existing.updatedAt !== body.expectedUpdatedAt) {
    return NextResponse.json(
      { error: "stale draft", currentUpdatedAt: existing.updatedAt },
      { status: 409 },
    )
  }

  let css: string | null = null
  if (typeof body.customCssGames === "string") {
    try {
      const sanitized = sanitizeCss(body.customCssGames)
      css = scopeCss(sanitized.css, orgId)
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 })
    }
  }

  const values = {
    brandingId: id,
    tokens: body.tokens as never,
    typography: body.typography as never,
    spacing: body.spacing as never,
    components: body.components as never,
    logoPath: body.logoPath ?? null,
    logoDarkPath: body.logoDarkPath ?? null,
    faviconPath: body.faviconPath ?? null,
    backgroundPath: body.backgroundPath ?? null,
    ogImagePath: body.ogImagePath ?? null,
    customCssGames: css,
    updatedAt: new Date().toISOString(),
  }

  if (existing) {
    await db.update(brandingDrafts).set(values).where(eq(brandingDrafts.id, existing.id))
  } else {
    await db.insert(brandingDrafts).values(values)
  }

  const [draft] = await db
    .select()
    .from(brandingDrafts)
    .where(eq(brandingDrafts.brandingId, id))
    .limit(1)

  return NextResponse.json({ draft })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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

  await db.delete(brandingDrafts).where(eq(brandingDrafts.brandingId, id))
  return NextResponse.json({ success: true })
}
