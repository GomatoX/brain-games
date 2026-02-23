import { getClientConfig } from "@/lib/platform";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const config = getClientConfig();

  return <LoginForm {...config} />;
}
