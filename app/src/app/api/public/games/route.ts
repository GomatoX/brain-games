import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  crosswords,
  wordgames,
  sudoku,
  wordsearches,
  branding,
  organizations,
} from "@/db/schema";
import { eq } from "drizzle-orm";
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
    if ("words" in game && "layout" in game) {
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
        gameData.main_word = (game as any).mainWord;
      } else if (game.words && game.words.length > 0) {
        // Compute layout on-the-fly for old crosswords without pre-computed layout
        const computed = computeCrosswordLayout(
          game.words as any,
          (game as any).mainWord || null,
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
        gameData.main_word = (game as any).mainWord;
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
        }));
      }
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
