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
