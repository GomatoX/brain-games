import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get the authenticated user's ID and org ID from the NextAuth session.
 * Returns null if not authenticated.
 */
export async function getSessionUserId(): Promise<{
  userId: string;
  orgId: string;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgId = (session.user as any).orgId as string;
  if (!orgId) return null;

  return { userId: session.user.id, orgId };
}

/**
 * Returns a 401 response if the user is not authenticated,
 * otherwise returns the user ID and org ID.
 */
export async function requireAuth(): Promise<
  { userId: string; orgId: string } | NextResponse
> {
  const result = await getSessionUserId();
  if (!result) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return result;
}
