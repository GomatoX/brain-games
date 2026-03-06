import { getClientConfig } from "@/lib/platform";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const config = getClientConfig();

  // Fetch the first org's logo for the login page branding
  // In white-label mode there's typically a single org
  const [org] = await db
    .select({ logoUrl: organizations.logoUrl })
    .from(organizations)
    .limit(1);

  return <LoginForm {...config} orgLogoUrl={org?.logoUrl || null} />;
}
