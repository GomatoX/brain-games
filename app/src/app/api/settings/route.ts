import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { orgId } = result;

  try {
    const [org] = await db
      .select({
        language: organizations.defaultLanguage,
        defaultBranding: organizations.defaultBranding,
        name: organizations.name,
      })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    return NextResponse.json({
      language: org?.language || "lt",
      default_branding: org?.defaultBranding || null,
      org_name: org?.name || null,
    });
  } catch {
    return NextResponse.json({
      language: "lt",
      default_branding: null,
      org_name: null,
    });
  }
}

export async function POST(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { orgId } = result;

  try {
    const body = await request.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: Record<string, any> = {};
    if (body.language !== undefined)
      updates.defaultLanguage = body.language || "lt";
    if (body.default_branding !== undefined)
      updates.defaultBranding = body.default_branding || null;
    if (body.org_name !== undefined) updates.name = body.org_name;

    await db
      .update(organizations)
      .set(updates)
      .where(eq(organizations.id, orgId));

    return NextResponse.json({
      language: body.language || "lt",
      default_branding: body.default_branding || null,
      org_name: body.org_name || null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
