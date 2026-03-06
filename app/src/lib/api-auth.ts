import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get the authenticated user's ID and org ID from the NextAuth session.
 * Returns null if not authenticated.
 */
export async function getSessionUserId(): Promise<{
  userId: string;
  orgId: string;
  orgRole: string;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgId = (session.user as any).orgId as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgRole = ((session.user as any).orgRole as string) || "member";
  if (!orgId) return null;

  return { userId: session.user.id, orgId, orgRole };
}

/**
 * Returns a 401 response if the user is not authenticated,
 * otherwise returns the user ID, org ID, and org role.
 */
export async function requireAuth(): Promise<
  { userId: string; orgId: string; orgRole: string } | NextResponse
> {
  const result = await getSessionUserId();
  if (!result) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return result;
}

/**
 * Returns a 403 response if the user is not the org owner.
 * Use this for owner-only API routes (settings, team management).
 */
export async function requireOwner(): Promise<
  { userId: string; orgId: string; orgRole: string } | NextResponse
> {
  const result = await requireAuth();
  if (result instanceof NextResponse) return result;

  if (result.orgRole !== "owner") {
    return NextResponse.json(
      { error: "Only the organization owner can perform this action" },
      { status: 403 },
    );
  }
  return result;
}
