"use client"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Grid3X3, LetterText, Search } from "lucide-react"

import {
  PLATFORM_PUZZLE_IDS,
  type PreviewGameType,
} from "@/lib/branding/platform-defaults"

const TAG_FOR: Record<PreviewGameType, string> = {
  crossword:  "crossword-game",
  wordsearch: "word-search-game",
  wordgame:   "word-game",
}

const PUZZLE_ID_ATTR: Record<PreviewGameType, string> = {
  crossword:  "puzzle-id",
  wordsearch: "puzzle-id",
  wordgame:   "game-id",
}

const ENGINE_FOR: Record<PreviewGameType, string> = {
  crossword:  "/crossword-engine.iife.js",
  wordsearch: "/word-search-engine.iife.js",
  wordgame:   "/word-game-engine.iife.js",
}

const TYPE_LABELS: Record<PreviewGameType, string> = {
  crossword:  "Crossword",
  wordsearch: "Word Search",
  wordgame:   "Word Game",
}

const TYPE_ICONS: Record<PreviewGameType, typeof Grid3X3> = {
  crossword:  Grid3X3,
  wordsearch: Search,
  wordgame:   LetterText,
}

const loadedScripts = new Set<PreviewGameType>()

function ensureEngineLoaded(type: PreviewGameType): Promise<void> {
  if (loadedScripts.has(type)) return Promise.resolve()
  loadedScripts.add(type)
  return new Promise((resolve) => {
    const s = document.createElement("script")
    s.src = ENGINE_FOR[type]
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => resolve()
    document.head.appendChild(s)
  })
}

type GameCtx = {
  type: PreviewGameType | null
  setType: (t: PreviewGameType) => void
  availableTypes: PreviewGameType[]
}

const GameContext = createContext<GameCtx>({
  type: null,
  setType: () => {},
  availableTypes: [],
})

type SharedProps = {
  availableTypes: PreviewGameType[]
  defaultType: PreviewGameType | null
}

const ALL_GAME_TYPES: PreviewGameType[] = ["wordsearch", "crossword", "wordgame"]

function Tabs(_props: SharedProps) {
  const ctx = useContext(GameContext)
  const active = ctx.type ?? "wordsearch"
  const setType = ctx.setType

  return (
    <div className="flex items-end gap-0.5" role="tablist">
      {ALL_GAME_TYPES.map((t) => {
        const Icon = TYPE_ICONS[t]
        const isActive = active === t
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setType(t)}
            className={`relative -mb-px flex items-center gap-2 rounded-t-lg border border-b-0 px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${
              isActive
                ? "z-[2] border-border bg-card text-foreground"
                : "border-transparent text-muted-foreground hover:bg-white/60 hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5 opacity-70" />
            {TYPE_LABELS[t]}
          </button>
        )
      })}
    </div>
  )
}

function Stage({ availableTypes, defaultType }: SharedProps) {
  const ctx = useContext(GameContext)
  const type = ctx.type ?? defaultType
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!type) return
    let cancelled = false
    void (async () => {
      await ensureEngineLoaded(type)
      if (cancelled || !hostRef.current) return
      hostRef.current.innerHTML = ""
      const el = document.createElement(TAG_FOR[type])
      el.setAttribute(PUZZLE_ID_ATTR[type], PLATFORM_PUZZLE_IDS[type])
      el.setAttribute("api-url", window.location.origin)
      el.setAttribute("lang", "en")
      hostRef.current.appendChild(el)
    })()
    return () => {
      cancelled = true
    }
  }, [type])

  if (availableTypes.length === 0 || !type) {
    return (
      <div
        className="rounded border border-border p-6 text-center text-sm"
        style={{ background: "var(--surface-elevated)" }}
      >
        <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
          No puzzles to preview yet
        </p>
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>
          Create your first puzzle to see your branding in action.
        </p>
        <Link
          href="/dashboard/crosswords/new"
          className="inline-block rounded px-3 py-1 text-white"
          style={{ background: "var(--primary)" }}
        >
          Create your first puzzle
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={hostRef}
      className="min-h-[400px] w-full"
    />
  )
}

function GamePreviewProvider({
  availableTypes,
  defaultType,
  children,
}: SharedProps & { children: React.ReactNode }) {
  const [type, setType] = useState<PreviewGameType | null>(defaultType)
  return (
    <GameContext.Provider value={{ type, setType, availableTypes }}>
      {children}
    </GameContext.Provider>
  )
}

const GamePreview = {
  Provider: GamePreviewProvider,
  Tabs,
  Stage,
}

export default GamePreview
