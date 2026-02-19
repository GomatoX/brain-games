import { getAccessToken } from "@/lib/auth-server";
import { directusGetGames } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login");

  const games = await directusGetGames(accessToken);

  return <DashboardContent initialGames={games} />;
}
