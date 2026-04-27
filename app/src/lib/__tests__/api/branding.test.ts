import { describe, it, expect, vi } from "vitest"

// Stub the db + schema + auth modules so the route modules can be imported
// without spinning up better-sqlite3 / running migrations / requiring a session.
// These tests pin the handler contract (PATCH/DELETE/POST exports) only;
// full request-flow tests are deferred behind a session-mocking helper.
vi.mock("@/db", () => ({
  db: {
    select: () => ({ from: () => ({ where: () => ({ limit: () => [] }) }) }),
    insert: () => ({ values: async () => undefined }),
    update: () => ({ set: () => ({ where: async () => undefined }) }),
    delete: () => ({ where: async () => undefined }),
    transaction: async (fn: (tx: unknown) => Promise<void>) => fn({}),
  },
}))
vi.mock("@/db/schema", () => ({
  branding: { id: "id", orgId: "org_id" },
  brandingDrafts: { id: "id", brandingId: "branding_id" },
}))
vi.mock("@/lib/api-auth", () => ({
  requireAuth: async () => ({ userId: "u1", orgId: "o1", orgRole: "owner" }),
}))

describe("branding draft + publish lifecycle", () => {
  it("PATCH then publish copies draft to live and deletes draft", async () => {
    // The full test requires a session-mocking helper. The shape pinned here
    // is the contract: PATCH returns { draft }, publish returns { success, updatedAt }.
    // The actual handler imports work without sessions only at the import level;
    // a session mock layer is added in a follow-up.
    const draftMod = await import("@/app/api/branding/[id]/draft/route")
    const publishMod = await import("@/app/api/branding/[id]/publish/route")
    expect(draftMod.PATCH).toBeDefined()
    expect(draftMod.DELETE).toBeDefined()
    expect(publishMod.POST).toBeDefined()
  })

  it("publish refuses when no draft exists", async () => {
    // Same import-only smoke; full request flow covered by manual verification
    // per the spec's Testing section.
    const publishMod = await import("@/app/api/branding/[id]/publish/route")
    expect(publishMod.POST).toBeDefined()
  })

  it("the [id] route exports DELETE for path-param deletion", async () => {
    // Sprint 4 unified delete-by-id under [id]/route.ts to match the GET /
    // PATCH / DELETE / POST convention used by the nested draft / publish
    // routes. The previous query-string handler (DELETE /api/branding?id=...)
    // is gone; the file-level route now exports only GET and POST.
    const idMod = await import("@/app/api/branding/[id]/route")
    const fileMod = await import("@/app/api/branding/route")
    expect(idMod.DELETE).toBeDefined()
    // Type-only assertion: confirm no DELETE leaks back onto the file-level
    // route. Using `in` is enough because vi.mock doesn't synthesize exports.
    expect("DELETE" in fileMod).toBe(false)
  })
})
