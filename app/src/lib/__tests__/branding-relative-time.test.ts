import { describe, it, expect } from "vitest"
import { formatRelativeTime } from "@/lib/branding/relative-time"

const NOW = new Date("2026-04-27T12:00:00.000Z")

describe("formatRelativeTime", () => {
  it("returns 'just now' for sub-minute differences", () => {
    expect(formatRelativeTime("2026-04-27T11:59:30.000Z", NOW)).toBe("just now")
  })

  it("returns minute count under an hour", () => {
    expect(formatRelativeTime("2026-04-27T11:55:00.000Z", NOW)).toBe("5m ago")
    expect(formatRelativeTime("2026-04-27T11:01:00.000Z", NOW)).toBe("59m ago")
  })

  it("returns hour count under a day", () => {
    expect(formatRelativeTime("2026-04-27T09:00:00.000Z", NOW)).toBe("3h ago")
    expect(formatRelativeTime("2026-04-26T13:00:00.000Z", NOW)).toBe("23h ago")
  })

  it("returns day count under a week", () => {
    expect(formatRelativeTime("2026-04-25T12:00:00.000Z", NOW)).toBe("2d ago")
    expect(formatRelativeTime("2026-04-21T12:00:00.000Z", NOW)).toBe("6d ago")
  })

  it("returns ISO date for older than a week", () => {
    expect(formatRelativeTime("2026-04-01T12:00:00.000Z", NOW)).toBe("2026-04-01")
  })

  it("handles future timestamps as 'just now' (clock skew safety)", () => {
    expect(formatRelativeTime("2026-04-27T12:00:30.000Z", NOW)).toBe("just now")
  })
})
