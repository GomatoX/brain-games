import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { branding } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
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
