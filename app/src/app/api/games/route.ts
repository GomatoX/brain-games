import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { crosswords, wordgames, sudoku, wordsearches, branding, users } from "@/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { requireAuth } from "@/lib/api-auth"
import { computeCrosswordLayout } from "@/lib/crossword-layout-server"
import { generateWordSearchGrid } from "@/lib/word-search-engine"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

type Collection = "crosswords" | "wordgames" | "sudoku" | "wordsearches";

const collections = { crosswords, wordgames, sudoku, wordsearches } as const;

export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId, orgId } = result;

  try {
    // Auto-promote any scheduled games whose time has passed
    await promoteScheduledGames()

    const [cw, wg, sd, ws] = await Promise.all([
      db
        .select({
          id: crosswords.id,
          status: crosswords.status,
          title: crosswords.title,
          difficulty: crosswords.difficulty,
          words: crosswords.words,
          mainWord: crosswords.mainWord,
          scheduledDate: crosswords.scheduledDate,
          brandingId: crosswords.brandingId,
          userId: crosswords.userId,
          orgId: crosswords.orgId,
          createdAt: crosswords.createdAt,
          updatedAt: crosswords.updatedAt,
          creatorFirstName: users.firstName,
          creatorLastName: users.lastName,
          creatorEmail: users.email,
        })
        .from(crosswords)
        .innerJoin(users, eq(users.id, crosswords.userId))
        .where(eq(crosswords.orgId, orgId))
        .orderBy(desc(crosswords.createdAt)),
      db
        .select({
          id: wordgames.id,
          status: wordgames.status,
          title: wordgames.title,
          word: wordgames.word,
          definition: wordgames.definition,
          maxAttempts: wordgames.maxAttempts,
          scheduledDate: wordgames.scheduledDate,
          brandingId: wordgames.brandingId,
          userId: wordgames.userId,
          orgId: wordgames.orgId,
          createdAt: wordgames.createdAt,
          updatedAt: wordgames.updatedAt,
          creatorFirstName: users.firstName,
          creatorLastName: users.lastName,
          creatorEmail: users.email,
        })
        .from(wordgames)
        .innerJoin(users, eq(users.id, wordgames.userId))
        .where(eq(wordgames.orgId, orgId))
        .orderBy(desc(wordgames.createdAt)),
      db
        .select({
          id: sudoku.id,
          status: sudoku.status,
          title: sudoku.title,
          difficulty: sudoku.difficulty,
          puzzle: sudoku.puzzle,
          solution: sudoku.solution,
          scheduledDate: sudoku.scheduledDate,
          brandingId: sudoku.brandingId,
          userId: sudoku.userId,
          orgId: sudoku.orgId,
          createdAt: sudoku.createdAt,
          updatedAt: sudoku.updatedAt,
          creatorFirstName: users.firstName,
          creatorLastName: users.lastName,
          creatorEmail: users.email,
        })
        .from(sudoku)
        .innerJoin(users, eq(users.id, sudoku.userId))
        .where(eq(sudoku.orgId, orgId))
        .orderBy(desc(sudoku.createdAt)),
      db
        .select({
          id: wordsearches.id,
          status: wordsearches.status,
          title: wordsearches.title,
          difficulty: wordsearches.difficulty,
          words: wordsearches.words,
          gridSize: wordsearches.gridSize,
          scheduledDate: wordsearches.scheduledDate,
          brandingId: wordsearches.brandingId,
          userId: wordsearches.userId,
          orgId: wordsearches.orgId,
          createdAt: wordsearches.createdAt,
          updatedAt: wordsearches.updatedAt,
          creatorFirstName: users.firstName,
          creatorLastName: users.lastName,
          creatorEmail: users.email,
        })
        .from(wordsearches)
        .innerJoin(users, eq(users.id, wordsearches.userId))
        .where(eq(wordsearches.orgId, orgId))
        .orderBy(desc(wordsearches.createdAt)),
    ]);

    return NextResponse.json({
      crosswords: cw.map(mapGame),
      wordgames: wg.map(mapGame),
      sudoku: sd.map(mapGame),
      wordsearches: ws.map(mapGame),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId, orgId } = result;

  try {
    const body = await request.json();
    const { collection, ...data } = body;

    if (!collection || !(collection in collections)) {
      return NextResponse.json(
        { error: "Valid collection is required" },
        { status: 400 },
      );
    }

    const table = collections[collection as Collection];
    const insertData = mapToDb(data, userId, orgId);

    // Auto-compute layout for crosswords
    if (collection === "crosswords" && data.words?.length > 0) {
      const layout = computeCrosswordLayout(data.words, data.main_word || null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (insertData as any).layout = layout;
    }

    // Auto-compute grid for word searches
    if (collection === "wordsearches" && data.words?.length > 0) {
      const wsLayout = generateWordSearchGrid(data.words, data.difficulty || "Medium");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (insertData as any).grid = wsLayout.grid;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (insertData as any).gridSize = wsLayout.gridSize;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [created] = await db
      .insert(table)
      .values(insertData as any)
      .returning();
    return NextResponse.json(mapGame(created));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId, orgId } = result;

  try {
    const body = await request.json();
    const { collection, id, ...data } = body;

    if (!collection || !id || !(collection in collections)) {
      return NextResponse.json(
        { error: "Collection and id are required" },
        { status: 400 },
      );
    }

    const table = collections[collection as Collection];
    const updateData = mapToDb(data);

    // Auto-recompute layout for crosswords when words change
    if (collection === "crosswords" && data.words?.length > 0) {
      const layout = computeCrosswordLayout(data.words, data.main_word || null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).layout = layout;
    }

    // Auto-recompute grid for word searches when words change
    if (collection === "wordsearches" && data.words?.length > 0) {
      const wsLayout = generateWordSearchGrid(data.words, data.difficulty || "Medium");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).grid = wsLayout.grid;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateData as any).gridSize = wsLayout.gridSize;
    }

    // Any org member can edit games
    const [updated] = await db
      .update(table)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(and(eq(table.id, id), eq(table.orgId, orgId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(mapGame(updated));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId, orgId } = result;

  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection") as Collection | null;
    const id = searchParams.get("id");

    if (!collection || !id || !(collection in collections)) {
      return NextResponse.json(
        { error: "Collection and id are required" },
        { status: 400 },
      );
    }

    const table = collections[collection];
    // Any org member can delete games
    const deleted = await db
      .delete(table)
      .where(and(eq(table.id, id), eq(table.orgId, orgId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

// ─── Helpers ────────────────────────────────────────────

/** Map DB row (camelCase) → API response (snake_case, Directus-compatible) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGame(row: any) {
  const creatorName =
    [row.creatorFirstName, row.creatorLastName].filter(Boolean).join(" ") ||
    row.creatorEmail ||
    null;

  return {
    id: row.id,
    status: row.status,
    title: row.title,
    difficulty: row.difficulty,
    words: row.words,
    main_word: row.mainWord,
    word: row.word,
    definition: row.definition,
    max_attempts: row.maxAttempts,
    puzzle: row.puzzle,
    solution: row.solution,
    grid_size: row.gridSize,
    scheduled_date: row.scheduledDate,
    branding: row.brandingId,
    user_created: row.userId,
    created_by: creatorName,
    org_id: row.orgId,
    date_created: row.createdAt,
    date_updated: row.updatedAt,
  };
}

/** Map API input (snake_case) → DB columns (camelCase) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToDb(data: Record<string, any>, userId?: string, orgId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped: Record<string, any> = {};

  if (userId) mapped.userId = userId;
  if (orgId) mapped.orgId = orgId;
  if (data.status !== undefined) mapped.status = data.status;
  if (data.title !== undefined) mapped.title = data.title;
  if (data.difficulty !== undefined) mapped.difficulty = data.difficulty;
  if (data.words !== undefined) mapped.words = data.words;
  if (data.main_word !== undefined) mapped.mainWord = data.main_word;
  if (data.word !== undefined) mapped.word = data.word;
  if (data.definition !== undefined) mapped.definition = data.definition;
  if (data.max_attempts !== undefined) mapped.maxAttempts = data.max_attempts;
  if (data.puzzle !== undefined) mapped.puzzle = data.puzzle;
  if (data.solution !== undefined) mapped.solution = data.solution;
  if (data.grid_size !== undefined) mapped.gridSize = data.grid_size;
  if (data.scheduled_date !== undefined)
    mapped.scheduledDate = data.scheduled_date;
  if (data.branding !== undefined) {
    if (!data.branding) {
      mapped.brandingId = null;
    } else {
      mapped.brandingId =
        typeof data.branding === "object" ? data.branding?.id : data.branding;
    }
  }

  return mapped;
}
