"use client";

import { useState } from "react";
import Link from "next/link";
import type { ComponentType } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  Home,
  Key,
  LayoutGrid,
  LogOut,
  Palette,
  Settings,
  Users,
} from "lucide-react";
import PlatformLogo from "@/components/PlatformLogo";
import DashboardTopbar from "@/components/DashboardTopbar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";


interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface SidebarProps {
  user: User;
  platformName: string;
  isWhiteLabel: boolean;
  orgLogoUrl?: string | null;
}

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
};

export default function DashboardSidebar({
  user,
  platformName,
  isWhiteLabel,
  orgLogoUrl,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const GAME_ROUTES = [
    "/dashboard/crosswords",
    "/dashboard/word-game",
    "/dashboard/word-search",
  ]
  const isOnGameRoute = GAME_ROUTES.some((r) => pathname.startsWith(r))
  const [gamesOpen, setGamesOpen] = useState(isOnGameRoute)

  const topNavItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
      active: pathname === "/dashboard",
    },
  ]

  const gamesSubItems = [
    {
      href: "/dashboard/crosswords",
      label: "Crosswords",
      active: pathname.startsWith("/dashboard/crosswords"),
    },
    {
      href: "/dashboard/word-game",
      label: "Word Game",
      active: pathname.startsWith("/dashboard/word-game"),
    },
    {
      href: "/dashboard/word-search",
      label: "Word Search",
      active: pathname.startsWith("/dashboard/word-search"),
    },
  ]

  const bottomNavItems: NavItem[] = [
    {
      href: "/dashboard/branding",
      label: "Branding",
      icon: Palette,
      active: pathname === "/dashboard/branding",
    },
    {
      href: "/dashboard/team",
      label: "Team",
      icon: Users,
      active: pathname === "/dashboard/team",
    },
    {
      href: "/dashboard/keys",
      label: "API Keys & Embeds",
      icon: Key,
      active: pathname === "/dashboard/keys",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ]

  async function handleLogout() {
    setLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/login");
  }

  const initials = (
    user.first_name?.[0] ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  const displayName = user.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user.email;

  const sidebarBody = (
    <>
      <Link
        href={isWhiteLabel ? "/dashboard" : "/"}
        className="h-16 flex items-center px-6 flex-shrink-0"
      >
        <PlatformLogo
          platformName={platformName}
          orgLogoUrl={orgLogoUrl}
          size="sm"
        />
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Top items */}
        {topNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 transition-all group rounded-[4px] border ${
              item.active
                ? "bg-white text-navy-900 shadow-sharp border-[#e2e8f0]"
                : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white"
            }`}
          >
            <item.icon
              className={`size-5 ${
                item.active ? "text-navy-900" : "text-[#94a3b8] group-hover:text-navy-900"
              }`}
            />
            <span className={`text-[14px] ${item.active ? "font-semibold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        ))}

        {/* Collapsible Games group */}
        <div>
          <button
            type="button"
            onClick={() => setGamesOpen((o) => !o)}
            className={`w-full flex items-center gap-3 px-3 py-2 transition-all rounded-[4px] border ${
              isOnGameRoute
                ? "border-transparent text-navy-900"
                : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white"
            }`}
            aria-expanded={gamesOpen}
            aria-label="Toggle Games menu"
          >
            <LayoutGrid
              className={`size-5 ${
                isOnGameRoute ? "text-navy-900" : "text-[#94a3b8]"
              }`}
            />
            <span className={`text-[14px] flex-1 text-left ${isOnGameRoute ? "font-semibold" : "font-medium"}`}>
              Games
            </span>
            <ChevronDown
              className={`size-4 text-[#94a3b8] transition-transform ${
                gamesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {gamesOpen && (
            <div className="mt-0.5 ml-3 pl-3 border-l border-[#e2e8f0] space-y-0.5">
              {gamesSubItems.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-[4px] border transition-all ${
                    sub.active
                      ? "bg-white text-navy-900 shadow-sharp border-[#e2e8f0] font-semibold"
                      : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white font-medium"
                  } text-[13px]`}
                >
                  {sub.label}
                </Link>
              ))}
              {/* Sudoku — coming soon */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#94a3b8] cursor-not-allowed">
                Sudoku
                <span className="ml-auto text-[9px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full font-medium">
                  soon
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom items */}
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-3 px-3 py-2 transition-all group rounded-[4px] border ${
              item.active
                ? "bg-white text-navy-900 shadow-sharp border-[#e2e8f0]"
                : "border-transparent text-[#64748b] hover:text-navy-900 hover:bg-white"
            }`}
          >
            <item.icon
              className={`size-5 ${
                item.active ? "text-navy-900" : "text-[#94a3b8] group-hover:text-navy-900"
              }`}
            />
            <span className={`text-[14px] ${item.active ? "font-semibold" : "font-medium"}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#e2e8f0] flex-shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-[4px] border border-[#e2e8f0] bg-[#f1f5f9] flex items-center justify-center text-navy-900 font-semibold text-xs flex-shrink-0">
              {initials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-navy-900 leading-none truncate">
                {displayName}
              </span>
              <span className="text-[10px] text-[#94a3b8] leading-tight mt-1 uppercase tracking-wider truncate">
                {user.email}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Sign Out"
            title="Sign Out"
            className="text-[#94a3b8] hover:text-navy-900 flex-shrink-0"
          >
            <LogOut className="size-[18px]" />
          </Button>
        </div>
        <p className="text-[9px] text-[#cbd5e1] mt-2 pl-11">
          v{process.env.NEXT_PUBLIC_APP_VERSION || "dev"}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop rail */}
      <aside className="hidden lg:flex w-[260px] flex-shrink-0 flex-col h-screen border-r border-[#e2e8f0] bg-[#F8FAFC] z-20 fixed">
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
          className="w-[280px] max-w-[85vw] flex flex-col bg-[#F8FAFC] border-r border-[#e2e8f0] p-0"
        >
          {sidebarBody}
        </SheetContent>
      </Sheet>
    </>
  );
}
