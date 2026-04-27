import { db } from "@/db"
import { crosswords, wordgames, sudoku, wordsearches } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { mergeUsageCounts } from "./usage-format"

export type { UsageRow } from "./usage-format"
export { mergeUsageCounts, formatUsageLabel } from "./usage-format"

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
