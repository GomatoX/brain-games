import { getClientConfig } from "@/lib/platform";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const config = getClientConfig();

  // Fetch first org's logo for branding (same as login page)
  const [org] = await db
    .select({ logoUrl: organizations.logoUrl })
    .from(organizations)
    .limit(1);

  return (
    <RegisterForm
      platformName={config.platformName}
      orgLogoUrl={org?.logoUrl || null}
    />
  );
}
