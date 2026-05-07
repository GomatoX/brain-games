"use client"

import Link from "next/link"
import { Grid3x3, Search, SpellCheck2, Grid } from "lucide-react"
import type { ComponentType } from "react"

/* ─── Types ─────────────────────────────────────────── */

type GameCounts = {
  crosswords: number
  wordgames: number
  wordsearches: number
  sudoku: number
}

type PerType = {
  crosswords: number
  wordgames: number
  wordsearches: number
}

type RecentGame = {
  id: string
  title: string
  type: "crossword" | "wordgame" | "wordsearch"
  sub: string
  updatedAt: string
  userId: string
  userName: string
}

type TopPuzzle = {
  id: string
  title: string
  type: "crossword" | "wordgame" | "wordsearch"
  plays: number
}

type DailyPlays = {
  date: string
  crosswords: number
  wordgames: number
  wordsearches: number
}

type HeatmapCell = {
  day: number
  hour: number
  count: number
}

interface Props {
  userName: string
  orgName: string
  counts: GameCounts
  published: PerType
  drafts: PerType
  plays: PerType
  recentGames: RecentGame[]
  topPuzzles: TopPuzzle[]
  dailyPlays: DailyPlays[]
  heatmapData: HeatmapCell[]
}

type GameDef = {
  id: string
  href: string | null
  label: string
  desc: string
  icon: ComponentType<{ className?: string }>
  color: string
  countKey: keyof GameCounts
  pubKey?: keyof PerType
  draftKey?: keyof PerType
  playsKey?: keyof PerType
  coming?: boolean
}

const GAMES: GameDef[] = [
  {
    id: "crossword",
    href: "/dashboard/crosswords",
    label: "Crosswords",
    desc: "Across-and-down clue grids. Editor with inline AI clue generation.",
    icon: Grid3x3,
    color: "#7e22ce",
    countKey: "crosswords",
    pubKey: "crosswords",
    draftKey: "crosswords",
    playsKey: "crosswords",
  },
  {
    id: "wordgame",
    href: "/dashboard/word-game",
    label: "Word Game",
    desc: "Single-word challenges with hints. Players guess letter by letter.",
    icon: SpellCheck2,
    color: "#15803d",
    countKey: "wordgames",
    pubKey: "wordgames",
    draftKey: "wordgames",
    playsKey: "wordgames",
  },
  {
    id: "wordsearch",
    href: "/dashboard/word-search",
    label: "Word Search",
    desc: "Hidden-word grids in any direction. Bulk-add or generate by topic.",
    icon: Search,
    color: "#c2410c",
    countKey: "wordsearches",
    pubKey: "wordsearches",
    draftKey: "wordsearches",
    playsKey: "wordsearches",
  },
  {
    id: "sudoku",
    href: null,
    label: "Sudoku",
    desc: "Number-placement on 9×9 grids. Difficulty from easy to expert.",
    icon: Grid,
    color: "#9a9285",
    countKey: "sudoku",
    coming: true,
  },
]

const TYPE_COLORS: Record<string, string> = {
  crossword: "#7e22ce",
  wordgame: "#15803d",
  wordsearch: "#c2410c",
}

const TYPE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  crossword: Grid3x3,
  wordgame: SpellCheck2,
  wordsearch: Search,
}

/* ─── Helpers ───────────────────────────────────────── */

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`)

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  return `${days} days ago`
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

/* ─── Sparkline ─────────────────────────────────────── */

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-[2px] h-6">
      {data.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-[1.5px] min-h-[2px]"
          style={{
            height: `${(v / max) * 100}%`,
            background: "var(--tool-accent)",
            opacity: i === data.length - 1 ? 1 : 0.55,
          }}
        />
      ))}
    </div>
  )
}

/* ─── Mini game previews ────────────────────────────── */

function MiniCrossword() {
  const cells = ["C", "A", "T", null, "b", "A", null, null, null, "A", "b", "D", "O", "G", "T"]
  return (
    <div className="grid grid-cols-5 gap-[1px]" style={{ gridAutoRows: 14 }}>
      {cells.map((c, i) => {
        if (c === "b")
          return <span key={i} className="rounded-[1.5px]" style={{ background: "var(--tool-text)", width: 14, height: 14 }} />
        if (c === null) return <span key={i} style={{ visibility: "hidden", width: 14 }} />
        return (
          <span
            key={i}
            className="rounded-[1.5px] grid place-items-center text-[8px] font-semibold border"
            style={{
              width: 14, height: 14,
              background: i === 1 ? "var(--tool-accent)" : "var(--tool-surface)",
              color: i === 1 ? "white" : "var(--tool-text)",
              borderColor: i === 1 ? "var(--tool-accent)" : "var(--tool-border)",
            }}
          >
            {c}
          </span>
        )
      })}
    </div>
  )
}

function MiniWordGame() {
  const rows = [
    ["B", "R", "A", "V", "E"].map((l, i) => ({ l, s: i === 2 ? "p" : i === 4 ? "c" : "x" })),
    ["S", "H", "A", "R", "K"].map((l, i) => ({ l, s: i === 2 ? "c" : i === 3 ? "p" : "x" })),
    ["C", "L", "E", "A", "N"].map((l) => ({ l, s: "c" })),
  ]
  const bg: Record<string, string> = { c: "var(--tool-good)", p: "#b45309", x: "#6b6357" }
  return (
    <div className="flex flex-col gap-[2px]">
      {rows.map((row, ri) => (
        <div key={ri} className="flex gap-[2px]">
          {row.map((t, i) => (
            <span key={i} className="grid place-items-center rounded-[2px] text-[9px] font-semibold font-mono text-white" style={{ width: 16, height: 18, background: bg[t.s] }}>
              {t.l}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function MiniWordSearch() {
  const grid = ["B", "R", "A", "I", "N", "S", "O", "S", "M", "A", "R", "T", "X", "C", "L", "E", "V", "E", "Q", "U", "I", "Z", "D", "R"]
  const highlight = new Set([0, 1, 2, 3, 4, 13, 14, 15, 16, 17])
  return (
    <div className="grid grid-cols-6 gap-[1px] font-mono text-[8px]">
      {grid.map((c, i) => (
        <span
          key={i}
          className="grid place-items-center rounded-[1.5px] border"
          style={{
            width: 13, height: 13,
            background: highlight.has(i) ? "rgba(21,128,61,0.18)" : "var(--tool-surface)",
            color: highlight.has(i) ? "var(--tool-good)" : "var(--tool-text-faint)",
            borderColor: highlight.has(i) ? "rgba(21,128,61,0.3)" : "var(--tool-border)",
            fontWeight: highlight.has(i) ? 600 : 400,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

function MiniSudoku() {
  const data = [5, "", 3, "", 7, "", "", 6, "", 1, "", 8, 4, "", "", 5, "", 2, "", 9, 7, "", 3, "", 2, "", 6, "", 4, "", "", 1, "", 7, "", 5]
  return (
    <div className="grid grid-cols-6 gap-[1px] p-[1px]" style={{ border: "1px solid var(--tool-text)", background: "var(--tool-text)" }}>
      {data.map((v, i) => (
        <span key={i} className="grid place-items-center font-mono text-[8px]" style={{ width: 12, height: 12, background: "var(--tool-surface)", color: typeof v === "number" ? "var(--tool-text-faint)" : "transparent", fontWeight: typeof v === "number" ? 400 : 600 }}>
          {v || " "}
        </span>
      ))}
    </div>
  )
}

const MINI_PREVIEWS: Record<string, () => React.ReactNode> = {
  crossword: MiniCrossword,
  wordgame: MiniWordGame,
  wordsearch: MiniWordSearch,
  sudoku: MiniSudoku,
}

/* ─── Plays-over-time chart (SVG) ───────────────────── */

function PlaysChart({
  series,
  labels,
}: {
  series: { name: string; color: string; data: number[] }[]
  labels: string[]
}) {
  const W = 720, H = 180, PADL = 36, PADR = 8, PADT = 12, PADB = 24
  const all = series.flatMap((s) => s.data)
  const max = Math.max(...all, 1) * 1.15
  const n = labels.length
  if (n < 2) return null
  const xPos = (i: number) => PADL + (i / (n - 1)) * (W - PADL - PADR)
  const yPos = (v: number) => PADT + (1 - v / max) * (H - PADT - PADB)

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"}${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(" ")
  const areaPath = (data: number[]) =>
    `${linePath(data)} L${xPos(n - 1).toFixed(1)},${(H - PADB).toFixed(1)} L${xPos(0).toFixed(1)},${(H - PADB).toFixed(1)} Z`

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t))

  return (
    <div className="h-[180px] relative">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full block overflow-visible">
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PADL} x2={W - PADR} y1={yPos(t)} y2={yPos(t)} stroke="var(--tool-border)" strokeDasharray={i === 0 ? "0" : "2 3"} />
            <text x={PADL - 6} y={yPos(t) + 3} fontSize="9" fontFamily="var(--font-jetbrains)" fill="var(--tool-text-faint)" textAnchor="end">
              {t >= 1000 ? `${(t / 1000).toFixed(0)}k` : t}
            </text>
          </g>
        ))}
        {labels.map(
          (l, i) =>
            (i % 2 === 0 || i === n - 1) && (
              <text key={i} x={xPos(i)} y={H - 6} fontSize="9" fontFamily="var(--font-jetbrains)" fill="var(--tool-text-faint)" textAnchor="middle">
                {l}
              </text>
            )
        )}
        {series.map((s, i) => (
          <path key={`a-${i}`} d={areaPath(s.data)} fill={`url(#grad-${i})`} />
        ))}
        {series.map((s, i) => (
          <path key={`l-${i}`} d={linePath(s.data)} fill="none" stroke={s.color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        ))}
        {series.map((s, i) => (
          <circle key={`d-${i}`} cx={xPos(n - 1)} cy={yPos(s.data[n - 1])} r="3.5" fill={s.color} stroke="var(--tool-surface)" strokeWidth="2" />
        ))}
      </svg>
    </div>
  )
}

/* ─── Donut chart ───────────────────────────────────── */

function Donut({ slices, total, label }: { slices: { color: string; value: number }[]; total: string; label: string }) {
  const R = 48, r = 32, C = 60
  let acc = 0
  const sum = slices.reduce((s, x) => s + x.value, 0) || 1
  return (
    <svg viewBox="0 0 120 120" className="w-[120px] h-[120px]">
      <circle cx={C} cy={C} r={(R + r) / 2} fill="none" stroke="var(--tool-surface-2)" strokeWidth={R - r} />
      {slices.map((s, i) => {
        const frac = s.value / sum
        const start = acc
        acc += frac
        const len = 2 * Math.PI * ((R + r) / 2)
        return (
          <circle key={i} cx={C} cy={C} r={(R + r) / 2} fill="none" stroke={s.color} strokeWidth={R - r} strokeDasharray={`${frac * len} ${len}`} strokeDashoffset={-start * len} transform={`rotate(-90 ${C} ${C})`} />
        )
      })}
      <text x={C} y={C - 2} textAnchor="middle" fill="var(--tool-text)" fontSize="20" fontWeight="600">{total}</text>
      <text x={C} y={C + 14} textAnchor="middle" fontSize="9" fontFamily="var(--font-jetbrains)" fill="var(--tool-text-faint)">{label}</text>
    </svg>
  )
}

/* ─── Heatmap from real data ────────────────────────── */

function HeatmapChart({ data }: { data: HeatmapCell[] }) {
  // days: 0=Sun,1=Mon,...6=Sat from strftime('%w')
  // Reorder to Mon-Sun for display
  const dayOrder = [1, 2, 3, 4, 5, 6, 0]
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const grid: number[][] = dayOrder.map(() => Array(24).fill(0))
  for (const cell of data) {
    const displayIdx = dayOrder.indexOf(cell.day)
    if (displayIdx >= 0 && cell.hour >= 0 && cell.hour < 24) {
      grid[displayIdx][cell.hour] = cell.count
    }
  }

  const max = Math.max(...grid.flat(), 1)
  const color = (v: number) => {
    const t = v / max
    if (t < 0.05) return "var(--tool-surface-2)"
    const alpha = 0.15 + t * 0.85
    return `rgba(194,65,12,${alpha.toFixed(2)})`
  }

  // Find peak and quiet
  let peakVal = 0, peakDay = "", peakHour = 0
  let quietVal = Infinity, quietDay = "", quietHour = 0
  for (let di = 0; di < 7; di++) {
    for (let h = 0; h < 24; h++) {
      if (grid[di][h] > peakVal) { peakVal = grid[di][h]; peakDay = dayLabels[di]; peakHour = h }
      if (grid[di][h] < quietVal) { quietVal = grid[di][h]; quietDay = dayLabels[di]; quietHour = h }
    }
  }

  const hasData = data.length > 0

  return (
    <>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: "24px repeat(24, 1fr)" }}>
        {dayLabels.map((d, di) => (
          <div key={di} className="contents">
            <span className="text-[10px] font-mono text-[var(--tool-text-faint)] grid place-items-center">{d}</span>
            {grid[di].map((v, h) => (
              <div key={h} className="aspect-square rounded-[2px]" style={{ background: color(v) }} title={`${d} ${h}:00 — ${v} plays`} />
            ))}
          </div>
        ))}
      </div>
      <div className="grid gap-[2px] mt-1" style={{ gridTemplateColumns: "24px repeat(24, 1fr)" }}>
        <span />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className="text-center text-[9px] font-mono text-[var(--tool-text-faint)]" style={{ visibility: h % 4 === 0 ? "visible" : "hidden" }}>
            {h}
          </span>
        ))}
      </div>
      {hasData && (
        <div className="mt-3.5 pt-3 border-t border-dashed border-border flex gap-6 text-xs text-[var(--tool-text-soft)]">
          <span><strong className="text-foreground">Peak</strong> · {peakHour}:00 {peakDay} ({fmt(peakVal)} plays)</span>
          <span><strong className="text-foreground">Quiet</strong> · {quietHour}:00 {quietDay} ({quietVal} plays)</span>
        </div>
      )}
      {!hasData && (
        <div className="mt-3 text-center text-[13px] text-[var(--tool-text-faint)]">No play data yet</div>
      )}
    </>
  )
}

/* ─── Main component ────────────────────────────────── */

const DashboardContent = ({
  userName, orgName, counts, published, drafts, plays,
  recentGames, topPuzzles, dailyPlays, heatmapData,
}: Props) => {
  const totalGames = counts.crosswords + counts.wordgames + counts.wordsearches + counts.sudoku
  const totalPublished = published.crosswords + published.wordgames + published.wordsearches
  const totalDrafts = drafts.crosswords + drafts.wordgames + drafts.wordsearches
  const totalPlays = plays.crosswords + plays.wordgames + plays.wordsearches

  // Build chart data from real dailyPlays
  const chartLabels = dailyPlays.map((d) => {
    const date = new Date(d.date + "T00:00:00")
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  })
  const chartSeries = [
    { name: "Crosswords", color: "#7e22ce", data: dailyPlays.map((d) => d.crosswords) },
    { name: "Word Game", color: "#15803d", data: dailyPlays.map((d) => d.wordgames) },
    { name: "Word Search", color: "#c2410c", data: dailyPlays.map((d) => d.wordsearches) },
  ]

  // Build sparklines from the last 8 days of dailyPlays
  const recentDays = dailyPlays.slice(-8)
  const totalSpark = recentDays.map((d) => d.crosswords + d.wordgames + d.wordsearches)
  const playsChartTotal = dailyPlays.reduce((s, d) => s + d.crosswords + d.wordgames + d.wordsearches, 0)

  // Top puzzle max plays for bar widths
  const topMaxPlays = Math.max(...topPuzzles.map((p) => p.plays), 1)

  return (
    <div className="flex flex-col gap-6">
      {/* ── Hero ── */}
      <div className="flex items-center justify-between gap-6 p-5 bg-card border border-border rounded-xl">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[var(--tool-text-faint)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--tool-good)]" style={{ boxShadow: "0 0 0 3px rgba(21,128,61,0.12)" }} />
            {orgName} workspace · all systems live
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight text-foreground m-0">
            {getGreeting()}, {userName}
          </h1>
          {totalDrafts > 0 && (
            <p className="text-[13.5px] text-[var(--tool-text-soft)] m-0">
              You have <strong className="text-foreground font-medium">{totalDrafts} unpublished draft{totalDrafts !== 1 ? "s" : ""}</strong> across your game library.
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/dashboard/crosswords" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] border border-border rounded-md bg-card hover:bg-[var(--tool-surface-2)] text-foreground no-underline transition-colors">
            View activity
          </Link>
          <Link href="/dashboard/crosswords" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] border border-transparent rounded-md text-white no-underline transition-colors" style={{ background: "var(--tool-accent)" }}>
            + New game
          </Link>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-border border border-border rounded-[10px] overflow-hidden">
        {[
          { label: "Total games", value: totalGames, spark: recentDays.map((_, i) => totalGames > 0 ? totalGames - recentDays.length + i + 1 : 0) },
          { label: "Published", value: totalPublished, spark: recentDays.map((_, i) => totalPublished > 0 ? totalPublished - recentDays.length + i + 1 : 0) },
          { label: "Total plays", value: totalPlays, spark: totalSpark },
          { label: "Plays (14d)", value: playsChartTotal, spark: totalSpark },
        ].map((s, i) => (
          <div key={i} className="bg-card p-4 flex flex-col gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--tool-text-faint)]">{s.label}</span>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[28px] font-semibold tracking-tight text-foreground leading-none">
                {fmt(s.value)}
              </span>
            </div>
            <Spark data={s.spark} />
          </div>
        ))}
      </div>

      {/* ── Game library ── */}
      <section>
        <div className="flex items-baseline gap-3 mb-3">
          <h2 className="text-sm font-semibold text-foreground m-0">Game library</h2>
          <span className="text-[12.5px] text-[var(--tool-text-faint)]">Pick a type to browse, filter, and create puzzles.</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {GAMES.map((g) => {
            const Icon = g.icon
            const Mini = MINI_PREVIEWS[g.id]
            const pub = g.pubKey ? published[g.pubKey] : 0
            const dft = g.draftKey ? drafts[g.draftKey] : 0
            const ply = g.playsKey ? plays[g.playsKey] : 0

            const card = (
              <div
                className={`relative overflow-hidden bg-card border border-border rounded-xl p-5 grid gap-[18px] transition-all ${
                  g.coming ? "bg-[var(--tool-bg)] opacity-[0.78]" : "hover:border-[var(--gc)] hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]"
                }`}
                style={{ "--gc": g.color, gridTemplateColumns: "1fr 140px" } as React.CSSProperties}
              >
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: g.coming ? "var(--tool-border-strong)" : g.color }} />
                <div className="flex flex-col gap-3.5 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg grid place-items-center shrink-0" style={{ background: g.coming ? "var(--tool-surface-2)" : g.color, color: g.coming ? "var(--tool-text-faint)" : "white", boxShadow: g.coming ? "none" : "0 1px 0 rgba(0,0,0,0.04), inset 0 -1px 0 rgba(0,0,0,0.06)" }}>
                      <Icon className="size-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2 m-0">
                        {g.label}
                        {g.coming && <span className="text-[9.5px] font-mono uppercase tracking-wider bg-[var(--tool-surface-2)] text-[var(--tool-text-faint)] px-1.5 py-0.5 rounded">Coming soon</span>}
                      </h3>
                      <p className="text-[12.5px] text-[var(--tool-text-soft)] leading-[1.45] m-0">{g.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-[18px] pt-2.5 border-t border-dashed border-border">
                    {[{ n: pub, label: "Published" }, { n: dft, label: "Drafts" }, { n: ply, label: "Plays" }].map((st) => (
                      <div key={st.label} className="flex flex-col gap-0.5">
                        <span className={`text-lg font-semibold leading-none ${g.coming ? "text-[var(--tool-text-faint)]" : "text-foreground"}`}>{g.coming ? "0" : fmt(st.n)}</span>
                        <span className="text-[10.5px] font-mono uppercase tracking-wider text-[var(--tool-text-faint)]">{st.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    {g.coming ? (
                      <button className="px-3 py-1.5 text-[13px] border border-border rounded-md bg-card text-foreground opacity-50 cursor-not-allowed" disabled>Notify me</button>
                    ) : (
                      <>
                        <Link href={g.href!} className="px-3 py-1.5 text-[13px] border border-transparent rounded-md text-white no-underline transition-colors" style={{ background: g.color }}>+ Create new</Link>
                        <Link href={g.href!} className="px-3 py-1.5 text-[13px] border border-border rounded-md bg-card hover:bg-[var(--tool-surface-2)] text-foreground no-underline transition-colors">Browse all →</Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-border grid place-items-center self-stretch overflow-hidden" style={{ background: g.coming ? "repeating-linear-gradient(45deg, var(--tool-bg) 0 6px, var(--tool-surface-2) 6px 12px)" : "linear-gradient(180deg, var(--tool-bg), var(--tool-surface-2))" }}>
                  <Mini />
                </div>
              </div>
            )

            return g.coming ? <div key={g.id}>{card}</div> : <div key={g.id} className="cursor-pointer">{card}</div>
          })}
        </div>
      </section>

      {/* ── Recently edited ── */}
      {recentGames.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-border">
            <h2 className="text-sm font-semibold m-0">Recently edited</h2>
            <span className="text-[12.5px] text-[var(--tool-text-faint)]">Pick up where you left off.</span>
            <span className="flex-1" />
            <Link href="/dashboard/crosswords" className="text-[12.5px] text-[var(--tool-accent)] no-underline hover:underline">View all →</Link>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Puzzle", "Type", "Edited by", "When"].map((th, i) => (
                  <th key={th} className="text-left px-[18px] py-2 text-[10.5px] uppercase tracking-wider text-[var(--tool-text-faint)] font-medium bg-[var(--tool-bg)] border-b border-border font-mono" style={i === 3 ? { textAlign: "right", paddingRight: 18 } : undefined}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentGames.map((r, i) => {
                const TypeIcon = TYPE_ICONS[r.type] || Grid3x3
                return (
                  <tr key={r.id} className="transition-colors hover:bg-[var(--tool-bg)] cursor-pointer" style={{ borderTop: i > 0 ? "1px solid var(--tool-border)" : undefined }}>
                    <td className="px-[18px] py-2.5 text-[13px]" style={{ width: "45%" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-[26px] h-[26px] rounded-md grid place-items-center text-white shrink-0" style={{ background: TYPE_COLORS[r.type] || "var(--tool-accent)" }}>
                          <TypeIcon className="size-3.5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{r.title}</div>
                          <div className="text-[11.5px] text-[var(--tool-text-faint)] font-mono">{r.sub}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-2.5 text-[12.5px] text-[var(--tool-text-soft)] capitalize">{r.type}</td>
                    <td className="px-[18px] py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-[22px] h-[22px] rounded-full grid place-items-center text-[10.5px] font-semibold shrink-0" style={{ background: "var(--tool-accent-soft)", color: "var(--tool-accent)" }}>{r.userName[0]?.toUpperCase()}</div>
                        <span className="text-[12.5px] text-[var(--tool-text-soft)]">{r.userName}</span>
                      </div>
                    </td>
                    <td className="px-[18px] py-2.5 text-right">
                      <span className="font-mono text-xs text-[var(--tool-text-faint)]">{timeAgo(r.updatedAt)}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Analytics: Plays chart + Donut ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-border">
            <h3 className="text-[13.5px] font-semibold m-0">Plays over time</h3>
            <span className="text-xs text-[var(--tool-text-faint)]">All games · last 14 days</span>
          </div>
          <div className="p-[18px]">
            {playsChartTotal > 0 ? (
              <>
                <PlaysChart labels={chartLabels} series={chartSeries} />
                <div className="flex gap-4 mt-3 pt-3 border-t border-dashed border-border flex-wrap">
                  {chartSeries.map((item) => {
                    const total14d = item.data.reduce((s, v) => s + v, 0)
                    return (
                      <span key={item.name} className="flex items-center gap-1.5 text-[11.5px] text-[var(--tool-text-soft)]">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                        {item.name} <strong className="text-foreground font-semibold ml-1">{fmt(total14d)}</strong>
                      </span>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="h-[180px] grid place-items-center text-[13px] text-[var(--tool-text-faint)]">
                No play data yet — plays will appear here once players start your games.
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-border">
            <h3 className="text-[13.5px] font-semibold m-0">Plays by game</h3>
            <span className="text-xs text-[var(--tool-text-faint)]">Share of total</span>
          </div>
          <div className="p-[18px]">
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <Donut
                total={fmt(totalPlays)}
                label="PLAYS"
                slices={[
                  { color: "#15803d", value: plays.wordgames },
                  { color: "#7e22ce", value: plays.crosswords },
                  { color: "#c2410c", value: plays.wordsearches },
                ]}
              />
              <div className="flex flex-col gap-2">
                {[
                  { color: "#15803d", name: "Word Game", val: plays.wordgames },
                  { color: "#7e22ce", name: "Crosswords", val: plays.crosswords },
                  { color: "#c2410c", name: "Word Search", val: plays.wordsearches },
                ].map((row) => (
                  <div key={row.name} className="grid grid-cols-[10px_1fr_auto] gap-2 items-center text-xs">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: row.color }} />
                    <span className="text-[var(--tool-text-soft)]">{row.name}</span>
                    <span className="font-mono text-[11.5px] text-foreground">{totalPlays ? `${Math.round((row.val / totalPlays) * 100)}%` : "0%"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top puzzles ── */}
      {topPuzzles.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-border">
            <h3 className="text-[13.5px] font-semibold m-0">Top performing puzzles</h3>
            <span className="text-xs text-[var(--tool-text-faint)]">Ranked by plays</span>
          </div>
          <div className="flex flex-col">
            {topPuzzles.map((r, i) => {
              const TypeIcon = TYPE_ICONS[r.type] || Grid3x3
              return (
                <div key={r.id} className="grid grid-cols-[18px_1fr_auto] gap-3 items-center px-[18px] py-3 cursor-pointer hover:bg-[var(--tool-bg)]" style={{ borderTop: i > 0 ? "1px solid var(--tool-border)" : undefined }}>
                  <span className="font-mono text-[11px] text-[var(--tool-text-faint)] text-center">#{i + 1}</span>
                  <div>
                    <div className="text-[13px] font-medium text-foreground flex items-center gap-2">
                      <div className="w-5 h-5 rounded grid place-items-center text-white shrink-0" style={{ background: TYPE_COLORS[r.type] }}>
                        <TypeIcon className="size-3" />
                      </div>
                      {r.title}
                      <span className="text-[9.5px] font-mono uppercase tracking-wider px-[5px] py-[2px] rounded-[3px] text-white" style={{ background: TYPE_COLORS[r.type] }}>{r.type}</span>
                    </div>
                    <div className="mt-1 h-1 bg-[var(--tool-surface-2)] rounded-sm overflow-hidden">
                      <span className="block h-full rounded-sm" style={{ width: `${(r.plays / topMaxPlays) * 100}%`, background: TYPE_COLORS[r.type] }} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-[12.5px] text-foreground font-semibold">{fmt(r.plays)}</span>
                    <span className="text-[11px] text-[var(--tool-text-faint)]">plays</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Heatmap ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-[18px] py-3.5 border-b border-border">
          <h3 className="text-[13.5px] font-semibold m-0">When players play</h3>
          <span className="text-xs text-[var(--tool-text-faint)]">Plays by day &amp; hour · last 30 days</span>
          <span className="flex-1" />
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--tool-text-faint)]">
            Less
            <div className="flex gap-[2px]">
              {["var(--tool-surface-2)", "rgba(194,65,12,0.25)", "rgba(194,65,12,0.5)", "rgba(194,65,12,0.75)", "rgba(194,65,12,1)"].map((c) => (
                <span key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
              ))}
            </div>
            More
          </div>
        </div>
        <div className="p-[18px]">
          <HeatmapChart data={heatmapData} />
        </div>
      </div>
    </div>
  )
}

export default DashboardContent
