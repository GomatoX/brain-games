import { getClientConfig, isWhiteLabel } from "@/lib/platform";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const config = getClientConfig();

  // Only fetch org logo in white-label mode (single org).
  // In SaaS mode we don't know which org is logging in.
  let orgLogoUrl: string | null = null;
  if (isWhiteLabel()) {
    const [org] = await db
      .select({ logoUrl: organizations.logoUrl })
      .from(organizations)
      .limit(1);
    orgLogoUrl = org?.logoUrl || null;
  }

  return <LoginForm {...config} orgLogoUrl={orgLogoUrl} />;
}
