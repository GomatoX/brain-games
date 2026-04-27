import { describe, it, expect } from "vitest"
import { hasPendingSave } from "@/lib/branding/unload-guard"

describe("hasPendingSave", () => {
  it("returns false when nothing is dirty and not saving", () => {
    expect(hasPendingSave({ dirty: false, saving: false })).toBe(false)
  })

  it("returns true while a save is in flight", () => {
    expect(hasPendingSave({ dirty: false, saving: true })).toBe(true)
  })

  it("returns true when there are dirty edits even if save is not yet running", () => {
    expect(hasPendingSave({ dirty: true, saving: false })).toBe(true)
  })

  it("returns true when both dirty and saving", () => {
    expect(hasPendingSave({ dirty: true, saving: true })).toBe(true)
  })
})
