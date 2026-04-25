import { getAuthenticatedUser } from "@/lib/auth-server";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import TeamContent from "@/components/TeamContent";
import DashboardContainer from "@/components/DashboardContainer";

export default async function TeamPage() {
  const user = await getAuthenticatedUser();

  const [org, members] = await Promise.all([
    db
      .select({ id: organizations.id, name: organizations.name })
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1)
      .then((rows) => rows[0]),
    db
      .select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        orgRole: users.orgRole,
        inviteToken: users.inviteToken,
        inviteExpiresAt: users.inviteExpiresAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.orgId, user.orgId)),
  ]);

  const initialData = {
    org: { id: org?.id ?? "", name: org?.name ?? "" },
    members: members.map((m) => ({
      id: m.id,
      email: m.email,
      first_name: m.firstName,
      last_name: m.lastName,
      org_role: m.orgRole,
      invite_pending: !!m.inviteToken,
      invite_expired:
        !!m.inviteToken &&
        !!m.inviteExpiresAt &&
        new Date(m.inviteExpiresAt) < new Date(),
      created_at: m.createdAt,
    })),
    currentUserId: user.id,
    isOwner: user.orgRole === "owner",
  };

  return (
    <DashboardContainer>
      <TeamContent initialData={initialData} />
    </DashboardContainer>
  );
}
