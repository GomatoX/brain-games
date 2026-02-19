import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type AppUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  apiToken: string | null;
};

/**
 * Get the authenticated user from the NextAuth session.
 * Redirects to /login if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<AppUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!user) redirect("/login");

  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
    apiToken: user.apiToken,
  };
}

/**
 * Get the authenticated user along with their static API token.
 */
export async function getAuthenticatedUserWithToken(): Promise<{
  user: AppUser;
  token: string | null;
}> {
  const user = await getAuthenticatedUser();
  return { user, token: user.apiToken };
}
