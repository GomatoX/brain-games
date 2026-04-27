import { db } from "@/db"
import { crosswords, wordgames, sudoku, wordsearches } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export type UsageRow = { brandingId: string | null; count: number }

/**
 * Merges per-table usage rows into a single Map<brandingId, totalCount>.
 * Rows with a null brandingId are dropped (those games have no brand attached).
 */
export const mergeUsageCounts = (perTable: UsageRow[][]): Map<string, number> => {
  const totals = new Map<string, number>()
  for (const rows of perTable) {
    for (const row of rows) {
      if (row.brandingId == null) continue
      totals.set(row.brandingId, (totals.get(row.brandingId) ?? 0) + row.count)
    }
  }
  return totals
}

/**
 * Returns the user-facing label for a usage count.
 */
export const formatUsageLabel = (count: number): string => {
  if (count === 0) return "Not used yet"
  if (count === 1) return "Used by 1 game"
  return `Used by ${count} games`
}

/**
 * Server-only: counts how many games per table reference each branding row
 * inside the given organization. Returns a map keyed by brandingId.
 *
 * Uses four small grouped queries in parallel rather than a UNION; this keeps
 * the SQL portable across the SQLite and Postgres builds.
 */
export const getBrandingUsageCounts = async (
  orgId: string,
): Promise<Map<string, number>> => {
  const countCol = sql<number>`count(*)`.mapWith(Number)

  const [cw, wg, sd, ws] = await Promise.all([
    db
      .select({ brandingId: crosswords.brandingId, count: countCol })
      .from(crosswords)
      .where(eq(crosswords.orgId, orgId))
      .groupBy(crosswords.brandingId),
    db
      .select({ brandingId: wordgames.brandingId, count: countCol })
      .from(wordgames)
      .where(eq(wordgames.orgId, orgId))
      .groupBy(wordgames.brandingId),
    db
      .select({ brandingId: sudoku.brandingId, count: countCol })
      .from(sudoku)
      .where(eq(sudoku.orgId, orgId))
      .groupBy(sudoku.brandingId),
    db
      .select({ brandingId: wordsearches.brandingId, count: countCol })
      .from(wordsearches)
      .where(eq(wordsearches.orgId, orgId))
      .groupBy(wordsearches.brandingId),
  ])

  return mergeUsageCounts([cw, wg, sd, ws])
}
