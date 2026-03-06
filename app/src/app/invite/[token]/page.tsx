import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import InviteForm from "./InviteForm";
import { getClientConfig } from "@/lib/platform";

export const dynamic = "force-dynamic";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const config = getClientConfig();

  // Look up the invite
  const [user] = await db
    .select({
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      orgId: users.orgId,
      inviteExpiresAt: users.inviteExpiresAt,
    })
    .from(users)
    .where(eq(users.inviteToken, token))
    .limit(1);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-8">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4 block">
              link_off
            </span>
            <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-2">
              Invalid Invite Link
            </h1>
            <p className="text-[#64748b] text-sm mb-6">
              This invite link is invalid or has already been used.
            </p>
            <a
              href="/login"
              className="inline-block bg-rust hover:bg-rust-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check expiry
  const isExpired =
    !!user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date();

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-8">
            <span className="material-symbols-outlined text-amber-500 text-5xl mb-4 block">
              schedule
            </span>
            <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-2">
              Invite Expired
            </h1>
            <p className="text-[#64748b] text-sm mb-6">
              This invite link has expired. Please ask your administrator to
              send a new invitation.
            </p>
            <a
              href="/login"
              className="inline-block bg-rust hover:bg-rust-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Get org name and logo
  const [org] = await db
    .select({ name: organizations.name, logoUrl: organizations.logoUrl })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1);

  return (
    <InviteForm
      token={token}
      email={user.email}
      firstName={user.firstName || ""}
      lastName={user.lastName || ""}
      orgName={org?.name || ""}
      platformName={config.platformName}
      orgLogoUrl={org?.logoUrl || null}
    />
  );
}
