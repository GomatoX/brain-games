import { ReactNode } from "react";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { getClientConfig } from "@/lib/platform";
import { db } from "@/db";
import { organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const config = getClientConfig();

  // Fetch org logo
  const [org] = await db
    .select({ logoUrl: organizations.logoUrl })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <DashboardSidebar
        user={user}
        platformName={config.platformName}
        isWhiteLabel={config.isWhiteLabel}
        orgLogoUrl={org?.logoUrl || null}
      />

      {/* Main Content */}
      <main className="flex-1 ml-[260px] h-screen overflow-y-auto">
        <div className="w-full max-w-[880px] mx-auto px-10 py-10 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
