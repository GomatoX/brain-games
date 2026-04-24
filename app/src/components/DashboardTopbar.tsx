"use client"

import Link from "next/link"
import PlatformLogo from "@/components/PlatformLogo"

interface DashboardTopbarProps {
  onOpenDrawer: () => void
  platformName: string
  isWhiteLabel: boolean
  orgLogoUrl?: string | null
}

export default function DashboardTopbar({
  onOpenDrawer,
  platformName,
  isWhiteLabel,
  orgLogoUrl,
}: DashboardTopbarProps) {
  return (
    <header className="lg:hidden fixed top-0 inset-x-0 h-14 z-30 flex items-center gap-3 px-3 bg-[#F8FAFC] border-b border-[#e2e8f0]">
      <button
        onClick={onOpenDrawer}
        className="p-2 text-[#64748b] hover:text-navy-900 transition-colors"
        aria-label="Open navigation"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>
      <Link
        href={isWhiteLabel ? "/dashboard" : "/"}
        className="flex items-center"
      >
        <PlatformLogo
          platformName={platformName}
          orgLogoUrl={orgLogoUrl}
          size="sm"
        />
      </Link>
    </header>
  )
}
