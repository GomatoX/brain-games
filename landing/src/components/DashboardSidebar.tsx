"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export default function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
  }

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: "dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/branding",
      label: "Branding",
      icon: "palette",
      active: pathname === "/dashboard/branding",
    },
    {
      href: "/dashboard/keys",
      label: "API Keys & Embeds",
      icon: "key",
      active: pathname === "/dashboard/keys",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col fixed h-full">
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-5 border-b border-[#e2e8f0]"
      >
        <span className="material-symbols-outlined text-[#c25e40] text-2xl">
          settings_suggest
        </span>
        <span className="text-lg font-bold font-serif text-[#0f172a]">
          Rustycogs.io
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-[#c25e40]/10 text-[#c25e40]"
                : "text-[#64748b] hover:bg-slate-50 hover:text-[#0f172a]"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-[#e2e8f0] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-[#c25e40]/10 rounded-full flex items-center justify-center text-[#c25e40] font-bold text-sm">
            {(user.first_name?.[0] || user.email?.[0] || "U").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#0f172a] truncate">
              {user.first_name
                ? `${user.first_name} ${user.last_name || ""}`
                : user.email}
            </p>
            <p className="text-xs text-[#64748b] truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2 text-sm text-[#64748b] hover:text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
