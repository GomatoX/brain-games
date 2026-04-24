import { ReactNode } from "react"
import { getAuthenticatedUser } from "@/lib/auth-server"
import { getClientConfig } from "@/lib/platform"
import { db } from "@/db"
import { organizations } from "@/db/schema"
import { eq } from "drizzle-orm"
import DashboardSidebar from "@/components/DashboardSidebar"
import SessionGuard from "@/components/SessionGuard"
import { resolveBrandForUser } from "@/lib/branding/resolve"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAuthenticatedUser()
  const config = getClientConfig()

  const [org] = await db
    .select({ logoUrl: organizations.logoUrl })
    .from(organizations)
    .where(eq(organizations.id, user.orgId))
    .limit(1)

  const { cssVars } = await resolveBrandForUser(user.id, user.orgId)

  return (
    <div
      className="min-h-screen flex"
      data-org-id={user.orgId}
      style={{ ...cssVars, background: "var(--surface)" } as React.CSSProperties}
    >
      <DashboardSidebar
        user={user}
        platformName={config.platformName}
        isWhiteLabel={config.isWhiteLabel}
        orgLogoUrl={org?.logoUrl || null}
      />
      <main className="flex-1 lg:ml-[260px] pt-14 lg:pt-0 h-screen overflow-y-auto">
        <div className="w-full max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24">
          <SessionGuard>{children}</SessionGuard>
        </div>
      </main>
    </div>
  )
}
