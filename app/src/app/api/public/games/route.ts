import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crosswords, wordgames, sudoku, branding, users } from "@/db/schema";
import { eq } from "drizzle-orm";

type GameType = "crosswords" | "wordgames" | "sudoku";

const tables = { crosswords, wordgames, sudoku } as const;

/**
 * Public API for game embeds.
 * GET /api/public/games?type=crosswords&id=xxx
 *
 * Auth: optional Bearer token (static API token from user settings)
 * If the game is "published", it's accessible without auth.
 * If "draft", requires the owner's API token.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as GameType | null;
  const id = searchParams.get("id");

  if (!type || !id || !(type in tables)) {
    return NextResponse.json(
      { error: "type and id are required" },
      { status: 400 },
    );
  }

  try {
    const table = tables[type];
    const [game] = await db
      .select()
      .from(table)
      .where(eq(table.id, id))
      .limit(1);

    if (!game) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // If draft, check token auth
    if (game.status !== "published") {
      const authHeader = request.headers.get("authorization");
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      // Verify token belongs to the game owner
      const [owner] = await db
        .select({ apiToken: users.apiToken })
        .from(users)
        .where(eq(users.id, game.userId))
        .limit(1);

      if (!owner || owner.apiToken !== token) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
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

    // Build Directus-compatible response shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameData: Record<string, any> = {
      id: game.id,
      status: game.status,
      title: game.title,
      branding: brandingData,
    };

    // Type-specific fields
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

    // Wrap in { data: ... } to match Directus response shape
    return NextResponse.json({ data: gameData });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 },
    );
  }
}
