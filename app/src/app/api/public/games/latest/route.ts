import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crosswords, wordgames, sudoku, wordsearches, branding, organizations } from "@/db/schema"
import { eq, desc, and, sql, or, lte } from "drizzle-orm"
import { computeCrosswordLayout } from "@/lib/crossword-layout-server";
import { deriveTokens } from "@/lib/branding/derive";
import type {
  BrandingTokens,
  BrandingTypography,
  BrandingSpacing,
  BrandingComponents,
} from "@/lib/branding/tokens";

type GameType = "crosswords" | "wordgames" | "sudoku" | "wordsearches";

const tables = { crosswords, wordgames, sudoku, wordsearches } as const;

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

    // Build condition: published OR (scheduled with past date)
    const publishedCondition = or(
      eq(table.status, "published"),
      and(
        eq(table.status, "scheduled"),
        lte(table.scheduledDate, new Date().toISOString()),
      ),
    )

    // Count total published + auto-publishable games for this org
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(table)
      .where(and(eq(table.orgId, orgId), publishedCondition))

    const total = countResult?.count || 0

    if (total === 0 || offset >= total) {
      return NextResponse.json(
        { error: "No published games found" },
        { status: 404, headers: corsHeaders },
      )
    }

    // Fetch the game at the given offset (0 = latest)
    const [game] = await db
      .select()
      .from(table)
      .where(and(eq(table.orgId, orgId), publishedCondition))
      .orderBy(desc(table.createdAt))
      .limit(1)
      .offset(offset)

    if (!game) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders },
      )
    }

    // Auto-promote if this was a scheduled game past its date
    if (game.status === "scheduled" && game.scheduledDate) {
      db.update(table)
        .set({
          status: "published",
          scheduledDate: null,
          updatedAt: new Date().toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .where(eq(table.id, game.id))
        .then(() =>
          console.log(`[schedule] Auto-published ${type}/${game.id}`),
        )
        .catch(() => {})

      game.status = "published"
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
          orgId: b.orgId,
          tokens: deriveTokens(
            (b.tokens as BrandingTokens) ?? {
              primary: "#c25e40",
              surface: "#ffffff",
              text: "#0f172a",
              overrides: {},
            },
          ),
          typography: (b.typography as BrandingTypography) ?? null,
          spacing: (b.spacing as BrandingSpacing) ?? null,
          components: (b.components as BrandingComponents) ?? null,
          logoPath: b.logoPath ?? null,
          customCssGames: b.customCssGames ?? null,
        };
      }
    }

    // Fetch org-level share config
    const [orgData] = await db
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
        image_url: orgData?.shareImageUrl || null,
        title: orgData?.shareTitle || null,
        description: orgData?.shareDescription || null,
      },
    }

    if ("mainWord" in game) {
      gameData.difficulty = game.difficulty;

      // Use pre-computed layout if available (anti-cheat: no answers sent)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const layout = (game as any).layout;
      if (layout) {
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
    // Word search fields
    if ("grid" in game && "gridSize" in game) {
      gameData.grid = game.grid;
      gameData.grid_size = game.gridSize;
      gameData.difficulty = game.difficulty;
      // Send words with hints but WITHOUT placement positions
      if (game.words && Array.isArray(game.words)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameData.words = (game.words as any[]).map((w: any) => ({
          word: w.word,
          hint: w.hint,
        }))
      }
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
