import { getClientConfig } from "@/lib/platform";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const config = getClientConfig();

  return <LoginForm {...config} />;
}
