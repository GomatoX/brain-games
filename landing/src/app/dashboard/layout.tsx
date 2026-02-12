"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function handleLogout() {
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
      href: "/dashboard/keys",
      label: "API Keys & Embeds",
      icon: "key",
      active: pathname === "/dashboard/keys",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center font-[family-name:var(--font-inter)]">
        <div className="flex items-center gap-3 text-[#64748b]">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex font-[family-name:var(--font-inter)]">
      {/* Sidebar */}
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
              {(user?.first_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0f172a] truncate">
                {user?.first_name
                  ? `${user.first_name} ${user.last_name || ""}`
                  : user?.email}
              </p>
              <p className="text-xs text-[#64748b] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-sm text-[#64748b] hover:text-red-600 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="max-w-5xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
