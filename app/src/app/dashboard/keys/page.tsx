import { getAuthenticatedUserWithToken } from "@/lib/auth-server";
import KeysContent from "@/components/KeysContent";

export default async function KeysPage() {
  const { token } = await getAuthenticatedUserWithToken();

  return <KeysContent initialToken={token} />;
}
