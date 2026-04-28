"use client"

import Link from "next/link"

interface OverviewCounts {
  crosswords: number
  wordgames: number
  wordsearches: number
  sudoku: number
}

export default function DashboardContent({
  counts,
}: {
  counts: OverviewCounts
}) {
  const sections = [
    {
      href: "/dashboard/crosswords",
      label: "Crosswords",
      icon: "grid_on",
      color: "blue",
      count: counts.crosswords,
    },
    {
      href: "/dashboard/word-game",
      label: "Word Games",
      icon: "spellcheck",
      color: "green",
      count: counts.wordgames,
    },
    {
      href: "/dashboard/word-search",
      label: "Word Search",
      icon: "search",
      color: "purple",
      count: counts.wordsearches,
    },
    {
      href: "#",
      label: "Sudoku",
      icon: "grid_4x4",
      color: "orange",
      count: counts.sudoku,
      comingSoon: true,
    },
  ]

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div>
      <div className="px-4 sm:px-6 py-6">
        <h1 className="text-xl font-bold text-[#0f172a] mb-1">Games Overview</h1>
        <p className="text-sm text-[#64748b]">Select a game type to manage and paginate through your games.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 pb-8">
        {sections.map((s) => {
          const card = (
            <div
              className={`bg-white border border-[#e2e8f0] rounded-[4px] shadow-sharp p-5 flex items-start gap-4 transition-colors ${
                s.comingSoon ? "opacity-60 cursor-not-allowed" : "hover:border-[#cbd5e1] hover:shadow-md cursor-pointer"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[s.color]}`}>
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-[#0f172a]">{s.count}</p>
                <p className="text-sm font-medium text-[#0f172a]">{s.label}</p>
                {s.comingSoon && (
                  <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          )
          return s.comingSoon ? (
            <div key={s.label}>{card}</div>
          ) : (
            <Link key={s.label} href={s.href} className="block">
              {card}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
