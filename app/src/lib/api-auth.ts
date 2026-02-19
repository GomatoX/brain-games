import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Get the authenticated user's ID from the NextAuth session.
 * Returns null if not authenticated.
 */
export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/**
 * Returns a 401 response if the user is not authenticated,
 * otherwise returns the user ID.
 */
export async function requireAuth(): Promise<
  { userId: string } | NextResponse
> {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return { userId };
}
