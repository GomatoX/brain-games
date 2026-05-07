"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Grid3x3,
  Home,
  Key,
  LogOut,
  Palette,
  Search,
  Settings,
  SpellCheck2,
  Users,
} from "lucide-react"
import PlatformLogo from "@/components/PlatformLogo"
import DashboardTopbar from "@/components/DashboardTopbar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface User {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
}

interface SidebarProps {
  user: User
  platformName: string
  isWhiteLabel: boolean
  orgLogoUrl?: string | null
}

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  soon?: boolean
}

export default function DashboardSidebar({
  user,
  platformName,
  isWhiteLabel,
  orgLogoUrl,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const overviewItems: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: Home },
  ]

  const gameItems: NavItem[] = [
    { href: "/dashboard/crosswords", label: "Crosswords", icon: Grid3x3 },
    { href: "/dashboard/word-game", label: "Word Game", icon: SpellCheck2 },
    { href: "/dashboard/word-search", label: "Word Search", icon: Search },
    { href: "#", label: "Sudoku", icon: Grid3x3, soon: true },
  ]

  const workspaceItems: NavItem[] = [
    { href: "/dashboard/branding", label: "Branding", icon: Palette },
    { href: "/dashboard/team", label: "Team", icon: Users },
    { href: "/dashboard/keys", label: "API Keys & Embeds", icon: Key },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = async () => {
    setLoggingOut(true)
    await signOut({ redirect: false })
    router.push("/login")
  }

  const initials = (
    user.first_name?.[0] ||
    user.email?.[0] ||
    "U"
  ).toUpperCase()

  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user.email

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href)

    if (item.soon) {
      return (
        <div
          key={item.label}
          className="nav-item-base nav-item-disabled"
        >
          <item.icon className="nav-item-icon" />
          <span>{item.label}</span>
          <span className="nav-soon-badge">SOON</span>
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setDrawerOpen(false)}
        className={`nav-item-base ${active ? "nav-item-active" : "nav-item-idle"}`}
        aria-current={active ? "page" : undefined}
      >
        <item.icon className="nav-item-icon" />
        <span>{item.label}</span>
      </Link>
    )
  }

  const sidebarBody = (
    <>
      {/* Brand mark */}
      <Link
        href={isWhiteLabel ? "/dashboard" : "/"}
        className="nav-brand-area"
      >
        <PlatformLogo
          platformName={platformName}
          orgLogoUrl={orgLogoUrl}
          size="sm"
        />
      </Link>

      <nav
        className="nav-body"
        aria-label="Main navigation"
      >
        {/* Overview */}
        {overviewItems.map(renderNavItem)}

        {/* Games section */}
        <div className="nav-section-label">Games</div>
        {gameItems.map(renderNavItem)}

        {/* Workspace section */}
        <div className="nav-section-label">Workspace</div>
        {workspaceItems.map(renderNavItem)}

        {/* Spacer */}
        <div className="flex-1" />
      </nav>

      {/* User section */}
      <div className="nav-user-section">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="nav-avatar">
            {initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="nav-user-name">
              {displayName}
            </span>
            <span className="nav-user-email">
              {user.email}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Sign Out"
          title="Sign Out"
          className="nav-logout-btn"
          tabIndex={0}
        >
          <LogOut className="size-[14px]" />
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop rail */}
      <aside
        className="hidden lg:flex w-[220px] flex-shrink-0 flex-col h-screen border-r border-border bg-card z-20 fixed"
        aria-label="Sidebar navigation"
      >
        {sidebarBody}
      </aside>

      {/* Mobile topbar */}
      <DashboardTopbar
        onOpenDrawer={() => setDrawerOpen(true)}
        platformName={platformName}
        isWhiteLabel={isWhiteLabel}
        orgLogoUrl={orgLogoUrl}
      />

      {/* Mobile drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="left"
          className="w-[260px] max-w-[85vw] flex flex-col bg-card border-r border-border p-0"
        >
          {sidebarBody}
        </SheetContent>
      </Sheet>
    </>
  )
}
