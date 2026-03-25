import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  crosswords,
  wordgames,
  sudoku,
  branding,
  organizations,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeCrosswordLayout } from "@/lib/crossword-layout-server";

type GameType = "crosswords" | "wordgames" | "sudoku";

const tables = { crosswords, wordgames, sudoku } as const;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Preflight handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * Public API for game embeds.
 * GET /api/public/games?type=crosswords&id=xxx
 *
 * Auth: optional Bearer token (org-level API token)
 * If the game is "published", it's accessible without auth.
 * If "draft", requires the org's API token.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as GameType | null;
  const id = searchParams.get("id");

  if (!type || !id || !(type in tables)) {
    return NextResponse.json(
      { error: "type and id are required" },
      { status: 400, headers: corsHeaders },
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
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // Auto-promote scheduled games whose time has passed
    if (
      game.status === "scheduled" &&
      game.scheduledDate &&
      new Date(game.scheduledDate) <= new Date()
    ) {
      // Fire-and-forget: promote to published in DB
      db.update(table)
        .set({
          status: "published",
          scheduledDate: null,
          updatedAt: new Date().toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .where(eq(table.id, id!))
        .then(() =>
          console.log(`[schedule] Auto-published ${type}/${id}`),
        )
        .catch(() => {})

      // Treat as published for this request
      game.status = "published"
    }

    // If draft or future-scheduled, check token auth against the org
    if (game.status !== "published") {
      const authHeader = request.headers.get("authorization")
      const token = authHeader?.replace("Bearer ", "")

      if (!token) {
        return NextResponse.json(
          { error: "Not found" },
          { status: 404, headers: corsHeaders },
        )
      }

      // Verify token belongs to the game's organization
      const [org] = await db
        .select({ apiToken: organizations.apiToken })
        .from(organizations)
        .where(eq(organizations.id, game.orgId))
        .limit(1)

      if (!org || org.apiToken !== token) {
        return NextResponse.json(
          { error: "Not found" },
          { status: 404, headers: corsHeaders },
        )
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
          correct_light_color: b.correctLightColor,
          present_color: b.presentColor,
          absent_color: b.absentColor,
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

    // Fetch org-level share config
    const [org] = await db
      .select({
        shareImageUrl: organizations.shareImageUrl,
        shareTitle: organizations.shareTitle,
        shareDescription: organizations.shareDescription,
      })
      .from(organizations)
      .where(eq(organizations.id, game.orgId))
      .limit(1)

    // Build response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gameData: Record<string, any> = {
      id: game.id,
      status: game.status,
      title: game.title,
      branding: brandingData,
      share: {
        image_url: org?.shareImageUrl || null,
        title: org?.shareTitle || null,
        description: org?.shareDescription || null,
      },
    }

    // Type-specific fields
    if ("words" in game) {
      gameData.difficulty = game.difficulty;

      // Use pre-computed layout if available (anti-cheat: no answers sent)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layout = (game as any).layout;
      if (layout) {
        // Send layout WITHOUT answers
        gameData.layout = {
          cells: layout.cells,
          clues: layout.clues,
          gridWidth: layout.gridWidth,
          gridHeight: layout.gridHeight,
          gridSize: layout.gridSize,
          seed: layout.seed,
          mainWord: layout.mainWord
            ? {
                word: layout.mainWord.word,
                cells: layout.mainWord.cells,
              }
            : undefined,
        };
        gameData.main_word = game.mainWord;
      } else if (game.words && game.words.length > 0) {
        // Compute layout on-the-fly for old crosswords without pre-computed layout
        const computed = computeCrosswordLayout(
          game.words,
          game.mainWord || null,
        );

        // Auto-save for future requests (fire-and-forget)
        db.update(crosswords)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .set({ layout: computed } as any)
          .where(eq(crosswords.id, game.id))
          .then(() =>
            console.log(`[layout] Auto-computed layout for ${game.id}`),
          )
          .catch(() => {});

        gameData.layout = {
          cells: computed.cells,
          clues: computed.clues,
          gridWidth: computed.gridWidth,
          gridHeight: computed.gridHeight,
          gridSize: computed.gridSize,
          seed: computed.seed,
          mainWord: computed.mainWord
            ? {
                word: computed.mainWord.word,
                cells: computed.mainWord.cells,
              }
            : undefined,
        };
        gameData.main_word = game.mainWord;
      }
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
    return NextResponse.json({ data: gameData }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500, headers: corsHeaders },
    );
  }
}
