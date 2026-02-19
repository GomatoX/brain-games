import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const [user] = await db
      .select({
        language: users.defaultLanguage,
        defaultBranding: users.defaultBranding,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      language: user?.language || "lt",
      default_branding: user?.defaultBranding || null,
    });
  } catch {
    return NextResponse.json({ language: "lt", default_branding: null });
  }
}

export async function POST(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const body = await request.json();

    await db
      .update(users)
      .set({
        defaultLanguage: body.language || "lt",
        defaultBranding: body.default_branding || null,
      })
      .where(eq(users.id, userId));

    return NextResponse.json({
      language: body.language || "lt",
      default_branding: body.default_branding || null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
