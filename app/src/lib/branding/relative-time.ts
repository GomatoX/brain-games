const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const WEEK_MS = 7 * DAY_MS

/**
 * Returns a short relative-time label for an ISO timestamp.
 * - Under 1 minute  → "just now"
 * - Under 1 hour    → "Nm ago"
 * - Under 1 day     → "Nh ago"
 * - Under 1 week    → "Nd ago"
 * - Otherwise       → ISO date (YYYY-MM-DD)
 *
 * `now` is injected for testability.
 */
export const formatRelativeTime = (iso: string, now: Date = new Date()): string => {
  const then = new Date(iso).getTime()
  const diff = now.getTime() - then
  if (diff < MINUTE_MS) return "just now"
  if (diff < HOUR_MS) return `${Math.floor(diff / MINUTE_MS)}m ago`
  if (diff < DAY_MS) return `${Math.floor(diff / HOUR_MS)}h ago`
  if (diff < WEEK_MS) return `${Math.floor(diff / DAY_MS)}d ago`
  return iso.slice(0, 10)
}
