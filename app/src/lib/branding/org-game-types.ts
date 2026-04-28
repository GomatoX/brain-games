import { db } from "@/db"
import { crosswords, wordgames, wordsearches, sudoku } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import type { PreviewGameType } from "./platform-defaults"

export type OrgGameType = "crossword" | "wordgame" | "wordsearch" | "sudoku"

// Order matters: callers iterate the priority list to pick the default preview
// type. Sudoku is intentionally omitted from PREVIEW_PRIORITY because its IIFE
// engine bundle isn't built yet (tracked as a separate Sprint 6 follow-up).
// `edit/page.tsx` filters availableGameTypes through the same list — keep the
// two in sync if the priority changes.
const PREVIEW_PRIORITY: readonly PreviewGameType[] = [
  "crossword",
  "wordgame",
  "wordsearch",
]

export const pickPreviewGameType = (
  available: Set<OrgGameType | string>,
): PreviewGameType | null => {
  for (const t of PREVIEW_PRIORITY) {
    if (available.has(t)) return t
  }
  return null
}

/**
 * Server-only: returns the set of game-types this org has at least one row in.
 * Mirrors the four-table fan-out from `getBrandingUsageCounts` but at the org
 * level and without per-branding grouping. Used by the editor's preview pane
 * to pick a default game type that the org actually has content for.
 */
export const getOrgGameTypes = async (
  orgId: string,
): Promise<Set<OrgGameType>> => {
  const exists = sql<number>`1`

  const [cw, wg, ws, sd] = await Promise.all([
    db.select({ x: exists }).from(crosswords).where(eq(crosswords.orgId, orgId)).limit(1),
    db.select({ x: exists }).from(wordgames).where(eq(wordgames.orgId, orgId)).limit(1),
    db.select({ x: exists }).from(wordsearches).where(eq(wordsearches.orgId, orgId)).limit(1),
    // We still query sudoku even though the button is hidden — useful for
    // future content-aware messaging ("you have sudoku puzzles but the engine
    // isn't shipped yet").
    db.select({ x: exists }).from(sudoku).where(eq(sudoku.orgId, orgId)).limit(1),
  ])

  const out = new Set<OrgGameType>()
  if (cw.length) out.add("crossword")
  if (wg.length) out.add("wordgame")
  if (ws.length) out.add("wordsearch")
  if (sd.length) out.add("sudoku")
  return out
}
