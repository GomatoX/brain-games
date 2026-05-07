"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import PlatformLogo from "@/components/PlatformLogo"

interface DashboardTopbarProps {
  onOpenDrawer: () => void
  platformName: string
  isWhiteLabel: boolean
  orgLogoUrl?: string | null
}

const DashboardTopbar = ({
  onOpenDrawer,
  platformName,
  isWhiteLabel,
  orgLogoUrl,
}: DashboardTopbarProps) => (
  <header className="lg:hidden fixed top-0 inset-x-0 h-12 z-30 flex items-center gap-3 px-3 bg-background border-b border-border">
    <button
      type="button"
      onClick={onOpenDrawer}
      aria-label="Open navigation"
      className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
    >
      <Menu className="size-[18px]" />
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

export default DashboardTopbar
