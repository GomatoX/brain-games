import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import {
  crosswords,
  wordgames,
  wordsearches,
  sudoku,
  users,
  playEvents,
} from "@/db/schema"
import { and, eq, count, sum, desc, sql, gte } from "drizzle-orm"
import DashboardContent from "@/components/DashboardContent"
import DashboardContainer from "@/components/DashboardContainer"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

export type RecentGame = {
  id: string
  title: string
  type: "crossword" | "wordgame" | "wordsearch"
  sub: string
  updatedAt: string
  userId: string
  userName: string
}

export type TopPuzzle = {
  id: string
  title: string
  type: "crossword" | "wordgame" | "wordsearch"
  plays: number
}

export type DailyPlays = {
  date: string
  crosswords: number
  wordgames: number
  wordsearches: number
}

export type HeatmapCell = {
  day: number
  hour: number
  count: number
}

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  await promoteScheduledGames()

  const oid = user.orgId

  // ── Counts, published, drafts, plays ──
  const [
    cwCount, wgCount, wsCount, sdCount,
    cwPub, wgPub, wsPub,
    cwDraft, wgDraft, wsDraft,
    cwPlays, wgPlays, wsPlays,
  ] = await Promise.all([
    db.select({ value: count() }).from(crosswords).where(eq(crosswords.orgId, oid)),
    db.select({ value: count() }).from(wordgames).where(eq(wordgames.orgId, oid)),
    db.select({ value: count() }).from(wordsearches).where(eq(wordsearches.orgId, oid)),
    db.select({ value: count() }).from(sudoku).where(eq(sudoku.orgId, oid)),
    db.select({ value: count() }).from(crosswords).where(and(eq(crosswords.orgId, oid), eq(crosswords.status, "published"))),
    db.select({ value: count() }).from(wordgames).where(and(eq(wordgames.orgId, oid), eq(wordgames.status, "published"))),
    db.select({ value: count() }).from(wordsearches).where(and(eq(wordsearches.orgId, oid), eq(wordsearches.status, "published"))),
    db.select({ value: count() }).from(crosswords).where(and(eq(crosswords.orgId, oid), eq(crosswords.status, "draft"))),
    db.select({ value: count() }).from(wordgames).where(and(eq(wordgames.orgId, oid), eq(wordgames.status, "draft"))),
    db.select({ value: count() }).from(wordsearches).where(and(eq(wordsearches.orgId, oid), eq(wordsearches.status, "draft"))),
    db.select({ value: sum(crosswords.plays) }).from(crosswords).where(eq(crosswords.orgId, oid)),
    db.select({ value: sum(wordgames.plays) }).from(wordgames).where(eq(wordgames.orgId, oid)),
    db.select({ value: sum(wordsearches.plays) }).from(wordsearches).where(eq(wordsearches.orgId, oid)),
  ])

  const n = (v: unknown) => Number(v ?? 0)

  // ── Recently edited (top 5 across all game types) ──
  const [cwRecent, wgRecent, wsRecent] = await Promise.all([
    db
      .select({ id: crosswords.id, title: crosswords.title, updatedAt: crosswords.updatedAt, userId: crosswords.userId })
      .from(crosswords)
      .where(eq(crosswords.orgId, oid))
      .orderBy(desc(crosswords.updatedAt))
      .limit(5),
    db
      .select({ id: wordgames.id, title: wordgames.title, updatedAt: wordgames.updatedAt, userId: wordgames.userId })
      .from(wordgames)
      .where(eq(wordgames.orgId, oid))
      .orderBy(desc(wordgames.updatedAt))
      .limit(5),
    db
      .select({ id: wordsearches.id, title: wordsearches.title, updatedAt: wordsearches.updatedAt, userId: wordsearches.userId })
      .from(wordsearches)
      .where(eq(wordsearches.orgId, oid))
      .orderBy(desc(wordsearches.updatedAt))
      .limit(5),
  ])

  const userIds = [
    ...new Set([
      ...cwRecent.map((r) => r.userId),
      ...wgRecent.map((r) => r.userId),
      ...wsRecent.map((r) => r.userId),
    ]),
  ]

  const userRows =
    userIds.length > 0
      ? await db
          .select({ id: users.id, firstName: users.firstName, email: users.email })
          .from(users)
          .where(sql`${users.id} IN (${sql.join(userIds.map((id) => sql`${id}`), sql`, `)})`)
      : []

  const userMap = Object.fromEntries(
    userRows.map((u) => [u.id, u.firstName || u.email.split("@")[0]])
  )

  const recentGames: RecentGame[] = [
    ...cwRecent.map((r) => ({ ...r, type: "crossword" as const, sub: "Crossword", userName: userMap[r.userId] || "Unknown" })),
    ...wgRecent.map((r) => ({ ...r, type: "wordgame" as const, sub: "Word Game", userName: userMap[r.userId] || "Unknown" })),
    ...wsRecent.map((r) => ({ ...r, type: "wordsearch" as const, sub: "Word Search", userName: userMap[r.userId] || "Unknown" })),
  ]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // ── Top performing puzzles (by plays) ──
  const [topCw, topWg, topWs] = await Promise.all([
    db
      .select({ id: crosswords.id, title: crosswords.title, plays: crosswords.plays })
      .from(crosswords)
      .where(eq(crosswords.orgId, oid))
      .orderBy(desc(crosswords.plays))
      .limit(5),
    db
      .select({ id: wordgames.id, title: wordgames.title, plays: wordgames.plays })
      .from(wordgames)
      .where(eq(wordgames.orgId, oid))
      .orderBy(desc(wordgames.plays))
      .limit(5),
    db
      .select({ id: wordsearches.id, title: wordsearches.title, plays: wordsearches.plays })
      .from(wordsearches)
      .where(eq(wordsearches.orgId, oid))
      .orderBy(desc(wordsearches.plays))
      .limit(5),
  ])

  const topPuzzles: TopPuzzle[] = [
    ...topCw.map((r) => ({ ...r, type: "crossword" as const })),
    ...topWg.map((r) => ({ ...r, type: "wordgame" as const })),
    ...topWs.map((r) => ({ ...r, type: "wordsearch" as const })),
  ]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 5)

  // ── Plays over time (last 14 days from playEvents) ──
  // Collect all org game IDs to filter playEvents
  const [cwIds, wgIds, wsIds] = await Promise.all([
    db.select({ id: crosswords.id }).from(crosswords).where(eq(crosswords.orgId, oid)),
    db.select({ id: wordgames.id }).from(wordgames).where(eq(wordgames.orgId, oid)),
    db.select({ id: wordsearches.id }).from(wordsearches).where(eq(wordsearches.orgId, oid)),
  ])

  const allGameIds = {
    crosswords: cwIds.map((r) => r.id),
    wordgames: wgIds.map((r) => r.id),
    wordsearches: wsIds.map((r) => r.id),
  }

  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10)

  // Query daily play counts per game type
  const dailyPlaysRaw = await db
    .select({
      date: sql<string>`date(${playEvents.playedAt})`.as("play_date"),
      gameType: playEvents.gameType,
      cnt: count(),
    })
    .from(playEvents)
    .where(gte(sql`date(${playEvents.playedAt})`, fourteenDaysAgo))
    .groupBy(sql`date(${playEvents.playedAt})`, playEvents.gameType)

  // Filter to only org games
  const orgGameIdSet = new Set([
    ...allGameIds.crosswords,
    ...allGameIds.wordgames,
    ...allGameIds.wordsearches,
  ])

  // We need to also filter by gameId for org scoping — but since we group,
  // let's query with a game ID filter instead
  const allOrgIds = [...orgGameIdSet]
  let dailyPlaysFiltered: typeof dailyPlaysRaw = []

  if (allOrgIds.length > 0) {
    dailyPlaysFiltered = await db
      .select({
        date: sql<string>`date(${playEvents.playedAt})`.as("play_date"),
        gameType: playEvents.gameType,
        cnt: count(),
      })
      .from(playEvents)
      .where(
        and(
          gte(sql`date(${playEvents.playedAt})`, fourteenDaysAgo),
          sql`${playEvents.gameId} IN (${sql.join(allOrgIds.map((id) => sql`${id}`), sql`, `)})`
        )
      )
      .groupBy(sql`date(${playEvents.playedAt})`, playEvents.gameType)
  }

  // Build 14-day series
  const dailyPlaysMap: Record<string, DailyPlays> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
    dailyPlaysMap[d] = { date: d, crosswords: 0, wordgames: 0, wordsearches: 0 }
  }
  for (const row of dailyPlaysFiltered) {
    const entry = dailyPlaysMap[row.date]
    if (!entry) continue
    const gt = row.gameType as keyof DailyPlays
    if (gt === "crosswords" || gt === "wordgames" || gt === "wordsearches") {
      entry[gt] = Number(row.cnt)
    }
  }
  const dailyPlays = Object.values(dailyPlaysMap)

  // ── Heatmap (plays by day-of-week and hour, last 30 days) ──
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)

  let heatmapData: HeatmapCell[] = []
  if (allOrgIds.length > 0) {
    const heatRaw = await db
      .select({
        dayOfWeek: sql<number>`cast(strftime('%w', ${playEvents.playedAt}) as integer)`.as("dow"),
        hour: sql<number>`cast(strftime('%H', ${playEvents.playedAt}) as integer)`.as("hr"),
        cnt: count(),
      })
      .from(playEvents)
      .where(
        and(
          gte(sql`date(${playEvents.playedAt})`, thirtyDaysAgo),
          sql`${playEvents.gameId} IN (${sql.join(allOrgIds.map((id) => sql`${id}`), sql`, `)})`
        )
      )
      .groupBy(
        sql`cast(strftime('%w', ${playEvents.playedAt}) as integer)`,
        sql`cast(strftime('%H', ${playEvents.playedAt}) as integer)`
      )

    heatmapData = heatRaw.map((r) => ({
      day: Number(r.dayOfWeek),
      hour: Number(r.hour),
      count: Number(r.cnt),
    }))
  }

  return (
    <DashboardContainer wide>
      <DashboardContent
        userName={user.first_name || user.email.split("@")[0]}
        orgName={user.orgName}
        counts={{
          crosswords: n(cwCount[0]?.value),
          wordgames: n(wgCount[0]?.value),
          wordsearches: n(wsCount[0]?.value),
          sudoku: n(sdCount[0]?.value),
        }}
        published={{
          crosswords: n(cwPub[0]?.value),
          wordgames: n(wgPub[0]?.value),
          wordsearches: n(wsPub[0]?.value),
        }}
        drafts={{
          crosswords: n(cwDraft[0]?.value),
          wordgames: n(wgDraft[0]?.value),
          wordsearches: n(wsDraft[0]?.value),
        }}
        plays={{
          crosswords: n(cwPlays[0]?.value),
          wordgames: n(wgPlays[0]?.value),
          wordsearches: n(wsPlays[0]?.value),
        }}
        recentGames={recentGames}
        topPuzzles={topPuzzles}
        dailyPlays={dailyPlays}
        heatmapData={heatmapData}
      />
    </DashboardContainer>
  )
}
