import { ReactNode } from "react"

export default function DashboardContainer({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24">
      {children}
    </div>
  )
}
