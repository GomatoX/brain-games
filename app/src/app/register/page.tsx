import { getClientConfig } from "@/lib/platform";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const config = getClientConfig();

  return <RegisterForm platformName={config.platformName} />;
}
