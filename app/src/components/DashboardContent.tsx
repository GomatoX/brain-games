"use client"

import Link from "next/link"

interface OverviewCounts {
  crosswords: number
  wordgames: number
  wordsearches: number
  sudoku: number
}

interface Props {
  counts: OverviewCounts
  publishedCount: number
}

const GAME_TYPES = [
  {
    href: "/dashboard/crosswords",
    label: "Crosswords",
    description: "Classic grid-based word puzzles with across and down clues.",
    icon: "grid_on",
    accent: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50 text-blue-600",
    countKey: "crosswords" as keyof OverviewCounts,
  },
  {
    href: "/dashboard/word-game",
    label: "Word Game",
    description: "Vocabulary and spelling challenges for players of all ages.",
    icon: "spellcheck",
    accent: "from-emerald-500 to-teal-500",
    iconBg: "bg-green-50 text-green-600",
    countKey: "wordgames" as keyof OverviewCounts,
  },
  {
    href: "/dashboard/word-search",
    label: "Word Search",
    description: "Hidden word grids — words concealed in any direction.",
    icon: "search",
    accent: "from-violet-500 to-pink-500",
    iconBg: "bg-purple-50 text-purple-600",
    countKey: "wordsearches" as keyof OverviewCounts,
  },
  {
    href: null,
    label: "Sudoku",
    description: "Classic number-placement puzzles on a 9×9 grid.",
    icon: "grid_4x4",
    accent: "from-orange-400 to-yellow-400",
    iconBg: "bg-orange-50 text-orange-500",
    countKey: "sudoku" as keyof OverviewCounts,
    comingSoon: true,
  },
]

export default function DashboardContent({ counts, publishedCount }: Props) {
  const totalGames = counts.crosswords + counts.wordgames + counts.wordsearches + counts.sudoku
  const activeTypes = GAME_TYPES.filter((g) => !g.comingSoon).length

  return (
    <div className="px-4 sm:px-6 py-6">
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a] tracking-tight mb-1">Games Overview</h1>
        <p className="text-sm text-[#64748b]">
          Manage your game library — select a type to browse, filter, and create puzzles.
        </p>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center bg-white border border-[#e2e8f0] rounded-[4px] shadow-sharp px-5 py-3.5 mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-bold text-[#0f172a] leading-none">{totalGames}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Total games</span>
        </div>
        <div className="w-px self-stretch bg-[#e2e8f0]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-bold text-[#0f172a] leading-none">{publishedCount}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Published</span>
        </div>
        <div className="w-px self-stretch bg-[#e2e8f0]" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xl font-bold text-[#0f172a] leading-none">{activeTypes}</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8]">Game types</span>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAME_TYPES.map((g) => {
          const cardContent = (
            <div
              className={`bg-white border border-[#e2e8f0] rounded-[4px] shadow-sharp overflow-hidden transition-all ${
                g.comingSoon
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md hover:border-[#cbd5e1] cursor-pointer"
              }`}
            >
              {/* Colored top accent */}
              <div className={`h-[3px] bg-gradient-to-r ${g.accent}`} />

              {/* Card body */}
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-[#0f172a] text-[15px] mb-1">{g.label}</p>
                  <p className="text-xs text-[#64748b] leading-relaxed">{g.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold text-[#0f172a] leading-none tracking-tight">
                    {g.comingSoon ? "—" : counts[g.countKey]}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#94a3b8] mt-1">
                    puzzles
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 pb-4 flex items-center justify-between">
                {g.comingSoon ? (
                  <span className="inline-flex items-center bg-blue-50 text-blue-600 text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                    Coming soon
                  </span>
                ) : (
                  <>
                    <span className="text-xs font-semibold text-indigo-600">View all →</span>
                    <span className="text-[11px] font-semibold px-3 py-1 border border-[#e2e8f0] rounded-[4px] text-[#0f172a] bg-[#f8fafc]">
                      ＋ Create new
                    </span>
                  </>
                )}
              </div>
            </div>
          )

          return g.comingSoon ? (
            <div key={g.label}>{cardContent}</div>
          ) : (
            <Link key={g.label} href={g.href!} className="block">
              {cardContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
