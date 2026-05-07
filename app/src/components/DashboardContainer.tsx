import { ReactNode } from "react"

export default function DashboardContainer({
  children,
  wide,
}: {
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div
      className={`w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-24 ${
        wide ? "max-w-[1280px]" : "max-w-[880px]"
      }`}
    >
      {children}
    </div>
  )
}
