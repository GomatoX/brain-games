import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { db } from "@/db"
import { playEvents, crosswords, wordgames, sudoku, wordsearches } from "@/db/schema"
import { eq, sql, and } from "drizzle-orm"

type GameType = "crosswords" | "wordgames" | "sudoku" | "wordsearches"

const tables = { crosswords, wordgames, sudoku, wordsearches } as const

const COOKIE_NAME = "bg_session"
const COOKIE_MAX_AGE = 86400 // 24 hours

const getCorsHeaders = (request: NextRequest) => ({
  "Access-Control-Allow-Origin": request.headers.get("origin") || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
})

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(request) })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id } = body as { type?: string; id?: string }

    if (!type || !id || !(type in tables)) {
      return NextResponse.json(
        { error: "type and id are required" },
        { status: 400, headers: getCorsHeaders(request) },
      )
    }

    const gameType = type as GameType

    // Get or create anonymous session cookie
    let sessionValue = request.cookies.get(COOKIE_NAME)?.value
    let isNewCookie = false
    if (!sessionValue) {
      sessionValue = crypto.randomUUID()
      isNewCookie = true
    }

    // Hash the session value — we never store the raw cookie
    const sessionHash = createHash("sha256").update(sessionValue).digest("hex")

    // Try to insert a dedup record. If the same session already played
    // this game, the unique constraint causes a conflict → no double count.
    const table = tables[gameType]
    let isNewPlay = false

    try {
      // Check if this session already played this game
      const existing = await db
        .select({ id: playEvents.id })
        .from(playEvents)
        .where(
          and(
            eq(playEvents.gameType, gameType),
            eq(playEvents.gameId, id),
            eq(playEvents.sessionHash, sessionHash),
          ),
        )
        .limit(1)

      if (existing.length === 0) {
        // New play — insert dedup record and increment counter
        await db.insert(playEvents).values({
          gameType,
          gameId: id,
          sessionHash,
        })

        await db
          .update(table)
          .set({ plays: sql`${table.plays} + 1` })
          .where(eq(table.id, id))

        isNewPlay = true
      }
    } catch {
      // If anything fails (e.g. unique constraint race), just skip
    }

    const response = NextResponse.json(
      { success: true, new: isNewPlay },
      { headers: getCorsHeaders(request) },
    )

    // Set the session cookie if it's new
    if (isNewCookie) {
      response.cookies.set(COOKIE_NAME, sessionValue, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      })
    }

    return response
  } catch {
    return NextResponse.json(
      { error: "Failed to record play" },
      { status: 500, headers: getCorsHeaders(request) },
    )
  }
}
