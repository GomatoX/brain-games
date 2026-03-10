import { getAuthenticatedUser } from "@/lib/auth-server";
import { db } from "@/db";
import { branding } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import BrandingContent from "@/components/BrandingContent";

export default async function BrandingPage() {
  const user = await getAuthenticatedUser();

  const presets = await db
    .select()
    .from(branding)
    .where(eq(branding.orgId, user.orgId))
    .orderBy(desc(branding.createdAt));

  // Map to frontend-compatible shape
  const mappedPresets = presets.map((p) => ({
    id: p.id,
    name: p.name,
    accent_color: p.accentColor,
    accent_hover_color: p.accentHoverColor,
    accent_light_color: p.accentLightColor,
    selection_color: p.selectionColor,
    selection_ring_color: p.selectionRingColor,
    highlight_color: p.highlightColor,
    correct_color: p.correctColor,
    correct_light_color: p.correctLightColor,
    present_color: p.presentColor,
    absent_color: p.absentColor,
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
    main_word_marker_color: p.mainWordMarkerColor,
    font_sans: p.fontSans,
    font_serif: p.fontSerif,
    border_radius: p.borderRadius,
  }));

  return <BrandingContent initialPresets={mappedPresets} />;
}
