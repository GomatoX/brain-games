import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crosswords, wordgames, sudoku, branding } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/api-auth";

type Collection = "crosswords" | "wordgames" | "sudoku";

const collections = { crosswords, wordgames, sudoku } as const;

export async function GET() {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;
  const { userId } = result;

  try {
    const [cw, wg, sd] = await Promise.all([
      db
        .select()
        .from(crosswords)
        .where(eq(crosswords.userId, userId))
        .orderBy(desc(crosswords.createdAt)),
      db
        .select()
        .from(wordgames)
        .where(eq(wordgames.userId, userId))
        .orderBy(desc(wordgames.createdAt)),
      db
        .select()
        .from(sudoku)
        .where(eq(sudoku.userId, userId))
        .orderBy(desc(sudoku.createdAt)),
    ]);

    // Map to Directus-compatible shape (camelCase → snake_case for frontend)
    return NextResponse.json({
      crosswords: cw.map(mapGame),
      wordgames: wg.map(mapGame),
      sudoku: sd.map(mapGame),
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
  const { userId } = result;

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
    const insertData = mapToDb(data, userId);

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
  const { userId } = result;

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

    const [updated] = await db
      .update(table)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(and(eq(table.id, id), eq(table.userId, userId)))
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
  const { userId } = result;

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
    const deleted = await db
      .delete(table)
      .where(and(eq(table.id, id), eq(table.userId, userId)))
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
    scheduled_date: row.scheduledDate,
    branding: row.brandingId,
    user_created: row.userId,
    date_created: row.createdAt,
    date_updated: row.updatedAt,
  };
}

/** Map API input (snake_case) → DB columns (camelCase) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToDb(data: Record<string, any>, userId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped: Record<string, any> = {};

  if (userId) mapped.userId = userId;
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
  if (data.scheduled_date !== undefined)
    mapped.scheduledDate = data.scheduled_date;
  if (data.branding !== undefined) {
    // branding can be an object { id: "..." } or a string ID
    mapped.brandingId =
      typeof data.branding === "object" ? data.branding?.id : data.branding;
  }

  return mapped;
}
