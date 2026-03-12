import { db } from "@/db"
import { crosswords, wordgames, sudoku } from "@/db/schema"
import { eq, and, lte } from "drizzle-orm"

const tables = { crosswords, wordgames, sudoku } as const
type Collection = keyof typeof tables

/**
 * Auto-promote all scheduled games whose scheduledDate has passed
 * to "published" status. Runs as a fire-and-forget batch update.
 *
 * Called on dashboard load and public API access to ensure
 * scheduled games go live without needing a cron job.
 */
export const promoteScheduledGames = async (): Promise<number> => {
  const now = new Date().toISOString()
  let totalPromoted = 0

  for (const [name, table] of Object.entries(tables) as [
    Collection,
    (typeof tables)[Collection],
  ][]) {
    try {
      const promoted = await db
        .update(table)
        .set({
          status: "published",
          scheduledDate: null,
          updatedAt: now,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any)
        .where(
          and(eq(table.status, "scheduled"), lte(table.scheduledDate, now)),
        )
        .returning()

      if (promoted.length > 0) {
        console.log(
          `[schedule] Auto-published ${promoted.length} ${name} game(s)`,
        )
        totalPromoted += promoted.length
      }
    } catch (err) {
      console.error(`[schedule] Failed to promote ${name}:`, err)
    }
  }

  return totalPromoted
}
