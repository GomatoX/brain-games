import { NextResponse } from "next/server";
import { db } from "@/db";
import { branding } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
