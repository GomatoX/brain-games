import { getAuthenticatedUserWithToken } from "@/lib/auth-server";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import KeysContent from "@/components/KeysContent";

export default async function KeysPage() {
  const { user, token } = await getAuthenticatedUserWithToken();

  const [org] = await db
    .select({ language: organizations.defaultLanguage })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1);

  const initialLang = org?.language || "lt";

  return (
    <KeysContent
      initialToken={token}
      orgId={user.orgId}
      initialLang={initialLang}
    />
  );
}
