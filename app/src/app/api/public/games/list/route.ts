import { NextResponse } from "next/server"
import { db } from "@/db"
import { crosswords, wordgames, sudoku } from "@/db/schema"
import { eq, desc, or, and, lte } from "drizzle-orm"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/**
 * List all published games across all types.
 * GET /api/public/games/list
 */
export async function GET() {
  try {
    // Auto-promote scheduled games whose time has passed
    await promoteScheduledGames()

    const publishedOrDue = (table: typeof crosswords | typeof wordgames | typeof sudoku) =>
      or(
        eq(table.status, "published"),
        and(
          eq(table.status, "scheduled"),
          lte(table.scheduledDate, new Date().toISOString()),
        ),
      )

    const [cw, wg, sd] = await Promise.all([
      db
        .select({
          id: crosswords.id,
          title: crosswords.title,
          createdAt: crosswords.createdAt,
        })
        .from(crosswords)
        .where(publishedOrDue(crosswords))
        .orderBy(desc(crosswords.createdAt))
        .limit(50),
      db
        .select({
          id: wordgames.id,
          title: wordgames.title,
          createdAt: wordgames.createdAt,
        })
        .from(wordgames)
        .where(publishedOrDue(wordgames))
        .orderBy(desc(wordgames.createdAt))
        .limit(50),
      db
        .select({
          id: sudoku.id,
          title: sudoku.title,
          createdAt: sudoku.createdAt,
        })
        .from(sudoku)
        .where(publishedOrDue(sudoku))
        .orderBy(desc(sudoku.createdAt))
        .limit(50),
    ])

    const games = [
      ...cw.map((g) => ({ ...g, type: "crossword" as const })),
      ...wg.map((g) => ({ ...g, type: "word" as const })),
      ...sd.map((g) => ({ ...g, type: "sudoku" as const })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({ data: games }, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Failed to list games" },
      { status: 500, headers: corsHeaders },
    );
  }
}
