import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, requireOwner } from "@/lib/api-auth";

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
        logoUrl: organizations.logoUrl,
        shareImageUrl: organizations.shareImageUrl,
        shareTitle: organizations.shareTitle,
        shareDescription: organizations.shareDescription,
      })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    return NextResponse.json({
      language: org?.language || "lt",
      default_branding: org?.defaultBranding || null,
      org_name: org?.name || null,
      logo_url: org?.logoUrl || null,
      share_image_url: org?.shareImageUrl || null,
      share_title: org?.shareTitle || null,
      share_description: org?.shareDescription || null,
    });
  } catch {
    return NextResponse.json({
      language: "lt",
      default_branding: null,
      org_name: null,
      logo_url: null,
      share_image_url: null,
      share_title: null,
      share_description: null,
    });
  }
}

export async function POST(request: NextRequest) {
  const result = await requireOwner();
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
    if (body.logo_url !== undefined) updates.logoUrl = body.logo_url || null;
    if (body.share_image_url !== undefined)
      updates.shareImageUrl = body.share_image_url || null;
    if (body.share_title !== undefined)
      updates.shareTitle = body.share_title || null;
    if (body.share_description !== undefined)
      updates.shareDescription = body.share_description || null;

    await db
      .update(organizations)
      .set(updates)
      .where(eq(organizations.id, orgId));

    return NextResponse.json({
      language: body.language || "lt",
      default_branding: body.default_branding || null,
      org_name: body.org_name || null,
      logo_url: body.logo_url || null,
      share_image_url: body.share_image_url || null,
      share_title: body.share_title || null,
      share_description: body.share_description || null,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
