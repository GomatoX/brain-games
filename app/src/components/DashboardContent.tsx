"use client"

import Link from "next/link"
import type { ComponentType } from "react"
import { Button } from "@/components/ui/button"
import { Grid, Grid3x3, Search, SpellCheck2 } from "lucide-react"

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

type GameType = {
  href: string | null
  label: string
  description: string
  icon: ComponentType<{ className?: string }>
  accentColor: string
  accentBg: string
  countKey: keyof OverviewCounts
  comingSoon?: boolean
}

const GAME_TYPES: GameType[] = [
  {
    href: "/dashboard/crosswords",
    label: "Crosswords",
    description: "Classic grid-based word puzzles with across and down clues.",
    icon: Grid3x3,
    accentColor: "#1d4ed8",
    accentBg: "#dbeafe",
    countKey: "crosswords",
  },
  {
    href: "/dashboard/word-game",
    label: "Word Game",
    description: "Vocabulary and spelling challenges for players of all ages.",
    icon: SpellCheck2,
    accentColor: "#15803d",
    accentBg: "#dcfce7",
    countKey: "wordgames",
  },
  {
    href: "/dashboard/word-search",
    label: "Word Search",
    description: "Hidden word grids — words concealed in any direction.",
    icon: Search,
    accentColor: "#7e22ce",
    accentBg: "#f3e8ff",
    countKey: "wordsearches",
  },
  {
    href: null,
    label: "Sudoku",
    description: "Classic number-placement puzzles on a 9×9 grid.",
    icon: Grid,
    accentColor: "#b45309",
    accentBg: "#fef3c7",
    countKey: "sudoku",
    comingSoon: true,
  },
]

const DashboardContent = ({ counts, publishedCount }: Props) => {
  const totalGames =
    counts.crosswords + counts.wordgames + counts.wordsearches + counts.sudoku
  const activeTypes = GAME_TYPES.filter((g) => !g.comingSoon).length

  return (
    <div>
      {/* Hero */}
      <div className="page-head mb-6">
        <div className="min-w-0 flex-1">
          <h1 className="page-title">Games Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5 mb-0">
            Manage your game library — select a type to browse, filter, and create
            puzzles.
          </p>
        </div>
      </div>

      {/* Summary strip */}
      <div className="mb-6 bg-card border border-border rounded-lg shadow-sharp">
        <div className="flex flex-wrap gap-x-6 gap-y-3 items-center px-5 py-3.5">
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-foreground leading-none">
              {totalGames}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Total games
            </span>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-foreground leading-none">
              {publishedCount}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Published
            </span>
          </div>
          <div className="w-px self-stretch bg-border" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xl font-bold text-foreground leading-none">
              {activeTypes}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Game types
            </span>
          </div>
        </div>
      </div>

      {/* Game cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAME_TYPES.map((g) => {
          const Icon = g.icon
          const cardContent = (
            <div
              className={`overflow-hidden rounded-lg border border-border bg-card transition-all ${
                g.comingSoon
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-md hover:border-border-strong cursor-pointer"
              }`}
            >
              {/* Colored top accent */}
              <div
                className="h-[3px]"
                style={{ background: g.accentColor }}
              />

              {/* Card body */}
              <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
                <div className="min-w-0 flex items-start gap-3">
                  <div
                    className="flex items-center justify-center size-8 rounded-md"
                    style={{
                      background: g.accentBg,
                      color: g.accentColor,
                    }}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-[15px] mb-1">
                      {g.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {g.description}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold text-foreground leading-none tracking-tight">
                    {g.comingSoon ? "—" : counts[g.countKey]}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                    puzzles
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-5 pb-4 flex items-center justify-between">
                {g.comingSoon ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: g.accentColor }}
                    >
                      View all →
                    </Button>
                    <Button variant="outline" size="sm">
                      ＋ Create new
                    </Button>
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

export default DashboardContent
