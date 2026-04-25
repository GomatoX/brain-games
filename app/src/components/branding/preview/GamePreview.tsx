"use client"
import { useEffect, useRef, useState } from "react"
import {
  PLATFORM_PUZZLE_IDS,
  type PreviewGameType,
} from "@/lib/branding/platform-defaults"

// Map UI game-type → Web Component tag (defined by the IIFE bundles)
const TAG_FOR: Record<PreviewGameType, string> = {
  crossword:  "crossword-game",
  wordsearch: "word-search-game",
  wordgame:   "word-game",
}

// Attribute name the IIFE element uses for the puzzle id
// (crossword/wordsearch use puzzle-id; wordgame uses game-id)
const PUZZLE_ID_ATTR: Record<PreviewGameType, string> = {
  crossword:  "puzzle-id",
  wordsearch: "puzzle-id",
  wordgame:   "game-id",
}

// Map UI game-type → IIFE script path (served from app/public/)
const ENGINE_FOR: Record<PreviewGameType, string> = {
  crossword:  "/crossword-engine.iife.js",
  wordsearch: "/word-search-engine.iife.js",
  wordgame:   "/word-game-engine.iife.js",
}

// Once a script is loaded into the page it sticks around — track which we've added.
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

export default function GamePreview() {
  const [type, setType] = useState<PreviewGameType>("crossword")
  const hostRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
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

  return (
    <div>
      <label className="block mb-3 text-sm">
        <span className="mr-2">Game type:</span>
        <select
          className="border rounded px-2 py-1"
          value={type}
          onChange={(e) => setType(e.target.value as PreviewGameType)}
        >
          <option value="crossword">Crossword</option>
          <option value="wordsearch">Word search</option>
          <option value="wordgame">Word game</option>
        </select>
      </label>
      <div
        ref={hostRef}
        className="border rounded p-2 min-h-[400px]"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      />
      {/* Branding cascades from the parent's data-brand-preview wrapper via CSS vars */}
    </div>
  )
}
