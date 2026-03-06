import { redirect } from "next/navigation";
import { auth } from "./auth";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export type AppUser = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  orgId: string;
  orgRole: string;
  orgName: string;
};

/**
 * Get the authenticated user from the NextAuth session.
 * Joins with organizations to include org context.
 * Redirects to /api/auth/logout (which clears cookies) if not authenticated,
 * preventing infinite redirect loops with stale JWT sessions.
 */
export async function getAuthenticatedUser(): Promise<AppUser> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/logout");
  }

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      orgId: users.orgId,
      orgRole: users.orgRole,
      orgName: organizations.name,
    })
    .from(users)
    .innerJoin(organizations, eq(organizations.id, users.orgId))
    .where(eq(users.id, session.user.id))
    .limit(1);

  if (!row) {
    redirect("/api/auth/logout");
  }

  return {
    id: row.id,
    email: row.email,
    first_name: row.firstName,
    last_name: row.lastName,
    role: row.role,
    orgId: row.orgId,
    orgRole: row.orgRole,
    orgName: row.orgName,
  };
}

/**
 * Get the authenticated user along with their org's API token.
 */
export async function getAuthenticatedUserWithToken(): Promise<{
  user: AppUser;
  token: string | null;
}> {
  const user = await getAuthenticatedUser();

  const [org] = await db
    .select({ apiToken: organizations.apiToken })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1);

  return { user, token: org?.apiToken ?? null };
}
