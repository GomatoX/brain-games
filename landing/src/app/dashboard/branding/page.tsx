import { getAccessToken } from "@/lib/auth-server";
import { directusGetBranding } from "@/lib/auth";
import { redirect } from "next/navigation";
import BrandingContent from "@/components/BrandingContent";

export default async function BrandingPage() {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const presets = await directusGetBranding(accessToken);

  return <BrandingContent initialPresets={presets} />;
}
