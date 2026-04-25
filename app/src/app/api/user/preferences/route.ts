import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"

export async function PATCH(request: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const { userId } = result

  const body = (await request.json()) as { usePlatformChrome?: boolean }
  if (typeof body.usePlatformChrome !== "boolean") {
    return NextResponse.json({ error: "usePlatformChrome must be boolean" }, { status: 400 })
  }

  await db
    .update(users)
    .set({ usePlatformChrome: body.usePlatformChrome })
    .where(eq(users.id, userId))

  return NextResponse.json({ success: true })
}
