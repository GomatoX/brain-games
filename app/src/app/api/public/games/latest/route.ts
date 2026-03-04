import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crosswords, wordgames, sudoku, branding } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

type GameType = "crosswords" | "wordgames" | "sudoku";

const tables = { crosswords, wordgames, sudoku } as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * Public API to fetch the latest published game with pagination.
 *
 * GET /api/public/games/latest?type=crosswords&org=ORG_ID
 * GET /api/public/games/latest?type=crosswords&org=ORG_ID&offset=1
 *
 * Also supports legacy `user=USER_ID` param (falls back to org lookup).
 *
 * Returns the latest published game (ordered by createdAt desc),
 * plus navigation metadata for history browsing.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as GameType | null;
  const orgId = searchParams.get("org") || searchParams.get("user");
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

  if (!type || !orgId || !(type in tables)) {
    return NextResponse.json(
      { error: "type and org are required" },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    const table = tables[type];

    // Count total published games for this org
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(and(eq(table.orgId, orgId), eq(table.status, "published")));

    const total = countResult?.count || 0;

    if (total === 0 || offset >= total) {
      return NextResponse.json(
        { error: "No published games found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Fetch the game at the given offset (0 = latest)
    const [game] = await db
      .select()
      .from(table)
      .where(and(eq(table.orgId, orgId), eq(table.status, "published")))
      .orderBy(desc(table.createdAt))
      .limit(1)
      .offset(offset);

    if (!game) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Fetch branding if assigned
    let brandingData = null;
    if (game.brandingId) {
      const [b] = await db
        .select()
        .from(branding)
        .where(eq(branding.id, game.brandingId))
        .limit(1);

      if (b) {
        brandingData = {
          id: b.id,
          name: b.name,
          accent_color: b.accentColor,
          accent_hover_color: b.accentHoverColor,
          accent_light_color: b.accentLightColor,
          selection_color: b.selectionColor,
          selection_ring_color: b.selectionRingColor,
          highlight_color: b.highlightColor,
          correct_color: b.correctColor,
          present_color: b.presentColor,
          bg_primary_color: b.bgPrimaryColor,
          bg_secondary_color: b.bgSecondaryColor,
          text_primary_color: b.textPrimaryColor,
          text_secondary_color: b.textSecondaryColor,
          border_color: b.borderColor,
          cell_bg_color: b.cellBgColor,
          cell_blocked_color: b.cellBlockedColor,
          sidebar_active_color: b.sidebarActiveColor,
          sidebar_active_bg_color: b.sidebarActiveBgColor,
          grid_border_color: b.gridBorderColor,
          font_sans: b.fontSans,
          font_serif: b.fontSerif,
          border_radius: b.borderRadius,
        };
      }
    }

    // Build response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameData: Record<string, any> = {
      id: game.id,
      status: game.status,
      title: game.title,
      branding: brandingData,
    };

    if ("words" in game) {
      gameData.words = game.words;
      gameData.main_word = game.mainWord;
      gameData.difficulty = game.difficulty;
    }
    if ("word" in game) {
      gameData.word = game.word;
      gameData.definition = game.definition;
      gameData.max_attempts = game.maxAttempts;
    }
    if ("puzzle" in game) {
      gameData.puzzle = game.puzzle;
      gameData.solution = game.solution;
      gameData.difficulty = game.difficulty;
    }

    return NextResponse.json(
      {
        data: gameData,
        meta: {
          current: offset,
          total,
          hasNewer: offset > 0,
          hasOlder: offset < total - 1,
        },
      },
      { headers: corsHeaders },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500, headers: corsHeaders },
    );
  }
}
