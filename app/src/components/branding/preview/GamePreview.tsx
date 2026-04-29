"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  wordsearch: "Word search",
  wordgame:   "Word game",
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

type Props = {
  /** Game types the current org has at least one puzzle in. Drives both the
   *  default selection and which buttons render. Empty array → empty state. */
  availableTypes: PreviewGameType[]
  /** Pre-resolved default (highest-priority available type). Null when the
   *  org has nothing yet. */
  defaultType: PreviewGameType | null
}

export default function GamePreview({ availableTypes, defaultType }: Props) {
  const [type, setType] = useState<PreviewGameType | null>(defaultType)
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

  // Empty-org state: no puzzles in any supported game type. Surface it with a
  // CTA instead of a broken iframe so the user knows brand changes still apply
  // — they just need content to preview against.
  if (availableTypes.length === 0 || !type) {
    return (
      <div
        className="border rounded p-6 text-center text-sm"
        style={{ borderColor: "var(--border)", background: "var(--surface-elevated)" }}
      >
        <p className="mb-2 font-medium" style={{ color: "var(--text)" }}>
          No puzzles to preview yet
        </p>
        <p className="mb-4" style={{ color: "var(--text-muted)" }}>
          Create your first puzzle to see your branding in action.
        </p>
        <Link
          href="/dashboard/crosswords/new"
          className="inline-block px-3 py-1 rounded text-white"
          style={{ background: "var(--primary)" }}
        >
          Create your first puzzle
        </Link>
      </div>
    )
  }

  return (
    <div>
      {availableTypes.length > 1 && (
        <div className="mb-3 flex gap-2 text-sm">
          <span className="self-center mr-1">Game type:</span>
          {availableTypes.map((t) => (
            <Button
              key={t}
              type="button"
              size="sm"
              variant={type === t ? "default" : "outline"}
              aria-pressed={type === t}
              onClick={() => setType(t)}
            >
              {TYPE_LABELS[t]}
            </Button>
          ))}
        </div>
      )}
      <div
        ref={hostRef}
        className="border rounded p-2 min-h-[400px]"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      />
      {/* Branding cascades from the parent's data-brand-preview wrapper via CSS vars */}
    </div>
  )
}
