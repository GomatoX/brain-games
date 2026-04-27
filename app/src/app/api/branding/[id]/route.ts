import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { branding, brandingDrafts } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result as { orgId: string }
  const { id } = await ctx.params

  const [live] = await db
    .select()
    .from(branding)
    .where(and(eq(branding.id, id), eq(branding.orgId, orgId)))
    .limit(1)

  if (!live) return NextResponse.json({ error: "not found" }, { status: 404 })

  const [draft] = await db
    .select()
    .from(brandingDrafts)
    .where(eq(brandingDrafts.brandingId, id))
    .limit(1)

  return NextResponse.json({ live, draft: draft ?? null })
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result as { orgId: string }
  const { id } = await ctx.params

  await db
    .delete(branding)
    .where(and(eq(branding.id, id), eq(branding.orgId, orgId)))

  return NextResponse.json({ success: true })
}
