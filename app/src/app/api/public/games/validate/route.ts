import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { crosswords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateAnswers } from "@/lib/crossword-layout-server";
import type { PreComputedLayout } from "@/lib/crossword-layout-server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () =>
  new NextResponse(null, { status: 204, headers: corsHeaders });

/**
 * Server-side answer validation for crosswords.
 *
 * POST /api/public/games/validate
 * Body: { id: string, answers: { "row,col": "LETTER" } }
 *
 * Returns: { correct, total, solvedWords }
 */
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { id, answers } = body;

    if (!id || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "id and answers are required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const [game] = await db
      .select()
      .from(crosswords)
      .where(eq(crosswords.id, id))
      .limit(1);

    if (!game) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layout = (game as any).layout as PreComputedLayout | null;

    if (!layout?.answers) {
      return NextResponse.json(
        { error: "Layout not available for this crossword" },
        { status: 400, headers: corsHeaders },
      );
    }

    const result = validateAnswers(layout, answers);

    return NextResponse.json(result, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500, headers: corsHeaders },
    );
  }
};
