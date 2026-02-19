import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { branding } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const presets = await db
      .select()
      .from(branding)
      .where(eq(branding.userId, userId))
      .orderBy(desc(branding.createdAt));

    return NextResponse.json(
      presets.map((p) => ({
        id: p.id,
        name: p.name,
        accent_color: p.accentColor,
        accent_hover_color: p.accentHoverColor,
        accent_light_color: p.accentLightColor,
        selection_color: p.selectionColor,
        selection_ring_color: p.selectionRingColor,
        highlight_color: p.highlightColor,
        correct_color: p.correctColor,
        present_color: p.presentColor,
        bg_primary_color: p.bgPrimaryColor,
        bg_secondary_color: p.bgSecondaryColor,
        text_primary_color: p.textPrimaryColor,
        text_secondary_color: p.textSecondaryColor,
        border_color: p.borderColor,
        cell_bg_color: p.cellBgColor,
        cell_blocked_color: p.cellBlockedColor,
        sidebar_active_color: p.sidebarActiveColor,
        sidebar_active_bg_color: p.sidebarActiveBgColor,
        grid_border_color: p.gridBorderColor,
        font_sans: p.fontSans,
        font_serif: p.fontSerif,
        border_radius: p.borderRadius,
      })),
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch branding" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const body = await request.json();

    const [preset] = await db
      .insert(branding)
      .values({
        userId,
        name: body.name || "Untitled",
        accentColor: body.accent_color || null,
        accentHoverColor: body.accent_hover_color || null,
        accentLightColor: body.accent_light_color || null,
        selectionColor: body.selection_color || null,
        selectionRingColor: body.selection_ring_color || null,
        highlightColor: body.highlight_color || null,
        correctColor: body.correct_color || null,
        presentColor: body.present_color || null,
        bgPrimaryColor: body.bg_primary_color || null,
        bgSecondaryColor: body.bg_secondary_color || null,
        textPrimaryColor: body.text_primary_color || null,
        textSecondaryColor: body.text_secondary_color || null,
        borderColor: body.border_color || null,
        cellBgColor: body.cell_bg_color || null,
        cellBlockedColor: body.cell_blocked_color || null,
        sidebarActiveColor: body.sidebar_active_color || null,
        sidebarActiveBgColor: body.sidebar_active_bg_color || null,
        gridBorderColor: body.grid_border_color || null,
        fontSans: body.font_sans || null,
        fontSerif: body.font_serif || null,
        borderRadius: body.border_radius || null,
      })
      .returning();

    return NextResponse.json({ id: preset.id, name: preset.name });
  } catch {
    return NextResponse.json(
      { error: "Failed to create branding" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db
      .update(branding)
      .set({
        name: body.name || "Untitled",
        accentColor: body.accent_color || null,
        accentHoverColor: body.accent_hover_color || null,
        accentLightColor: body.accent_light_color || null,
        selectionColor: body.selection_color || null,
        selectionRingColor: body.selection_ring_color || null,
        highlightColor: body.highlight_color || null,
        correctColor: body.correct_color || null,
        presentColor: body.present_color || null,
        bgPrimaryColor: body.bg_primary_color || null,
        bgSecondaryColor: body.bg_secondary_color || null,
        textPrimaryColor: body.text_primary_color || null,
        textSecondaryColor: body.text_secondary_color || null,
        borderColor: body.border_color || null,
        cellBgColor: body.cell_bg_color || null,
        cellBlockedColor: body.cell_blocked_color || null,
        sidebarActiveColor: body.sidebar_active_color || null,
        sidebarActiveBgColor: body.sidebar_active_bg_color || null,
        gridBorderColor: body.grid_border_color || null,
        fontSans: body.font_sans || null,
        fontSerif: body.font_serif || null,
        borderRadius: body.border_radius || null,
      })
      .where(and(eq(branding.id, body.id), eq(branding.userId, userId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update branding" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    await db
      .delete(branding)
      .where(and(eq(branding.id, id), eq(branding.userId, userId)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete branding" },
      { status: 500 },
    );
  }
}
