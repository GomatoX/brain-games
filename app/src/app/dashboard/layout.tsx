import { ReactNode } from "react";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { getClientConfig } from "@/lib/platform";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const config = getClientConfig();

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-[family-name:var(--font-inter)]">
      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        platformName={config.platformName}
        isWhiteLabel={config.isWhiteLabel}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
