"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import PlatformLogo from "@/components/PlatformLogo"
import { Button } from "@/components/ui/button"

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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onOpenDrawer}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>
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
