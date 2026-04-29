import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Link2Off, Clock } from "lucide-react";
import InviteForm from "./InviteForm";
import { getClientConfig } from "@/lib/platform";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
      <ErrorShell
        icon={<Link2Off className="size-12 text-destructive mx-auto" />}
        title="Invalid Invite Link"
        message="This invite link is invalid or has already been used."
      />
    );
  }

  const isExpired =
    !!user.inviteExpiresAt && new Date(user.inviteExpiresAt) < new Date();

  if (isExpired) {
    return (
      <ErrorShell
        icon={<Clock className="size-12 text-amber-500 mx-auto" />}
        title="Invite Expired"
        message="This invite link has expired. Please ask your administrator to send a new invitation."
      />
    );
  }

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

const ErrorShell = ({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) => (
  <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4 font-[family-name:var(--font-inter)]">
    <div className="w-full max-w-md text-center">
      <Card>
        <CardContent className="p-8">
          <div className="mb-4">{icon}</div>
          <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-2">
            {title}
          </h1>
          <p className="text-[#64748b] text-sm mb-6">{message}</p>
          <Button asChild>
            <a href="/login">Go to Login</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
);
