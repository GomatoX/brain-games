import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { branding } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"
import { PRESETS } from "@/lib/branding/presets"

export async function GET() {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result

  const presets = await db
    .select()
    .from(branding)
    .where(eq(branding.orgId, orgId))
    .orderBy(desc(branding.createdAt))

  return NextResponse.json(presets)
}

export async function POST(request: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result

  const body = (await request.json()) as { name?: string; presetId?: string }
  const seed = PRESETS.find((p) => p.id === body.presetId) ?? PRESETS[0]

  const [row] = await db
    .insert(branding)
    .values({
      orgId,
      name: body.name || "Untitled",
      tokens: seed.tokens,
      typography: { fontSans: null, fontSerif: null, scale: "default" },
      spacing: { density: "cozy", radius: 8 },
      components: {
        button: { variant: "solid", shadow: "subtle" },
        input: { variant: "outlined" },
        card: { elevation: "subtle" },
      },
    })
    .returning()

  return NextResponse.json({ id: row.id, name: row.name })
}

export async function DELETE(request: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { orgId } = result
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

  await db.delete(branding).where(and(eq(branding.id, id), eq(branding.orgId, orgId)))
  return NextResponse.json({ success: true })
}
