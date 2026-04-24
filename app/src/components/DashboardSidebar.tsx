"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import PlatformLogo from "@/components/PlatformLogo";
import DashboardTopbar from "@/components/DashboardTopbar";


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

  // Lock body scroll + ESC to close while drawer open
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [drawerOpen]);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/login");
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Games",
      icon: "stacks",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/branding",
      label: "Branding",
      icon: "branding_watermark",
      active: pathname === "/dashboard/branding",
    },
    {
      href: "/dashboard/team",
      label: "Team",
      icon: "groups",
      active: pathname === "/dashboard/team",
    },
    {
      href: "/dashboard/keys",
      label: "API Keys & Embeds",
      icon: "key",
      active: pathname === "/dashboard/keys",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: "settings",
      active: pathname === "/dashboard/settings",
    },
  ];

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
        {navItems.map((item) => (
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
            <span
              className={`material-symbols-outlined text-[20px] ${
                item.active
                  ? "text-navy-900"
                  : "text-[#94a3b8] group-hover:text-navy-900"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[14px] ${item.active ? "font-semibold" : "font-medium"}`}
            >
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
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-[#94a3b8] hover:text-navy-900 p-1 transition-colors disabled:opacity-50 flex-shrink-0"
            title="Sign Out"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
          </button>
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
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] flex flex-col bg-[#F8FAFC] border-r border-[#e2e8f0] shadow-xl transform transition-transform ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarBody}
        </aside>
      </div>
    </>
  );
}
