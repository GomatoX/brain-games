"use client"
import { useState } from "react"

type GameType = "crossword" | "wordsearch" | "wordgame"

export default function GamePreview() {
  const [type, setType] = useState<GameType>("crossword")

  return (
    <div>
      <select
        className="mb-3 border rounded px-2 py-1"
        value={type}
        onChange={(e) => setType(e.target.value as GameType)}
      >
        <option value="crossword">Crossword</option>
        <option value="wordsearch">Word search</option>
        <option value="wordgame">Word game</option>
      </select>
      <div className="border rounded p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        {type === "crossword" && <CrosswordMock />}
        {type === "wordsearch" && <WordsearchMock />}
        {type === "wordgame" && <WordgameMock />}
      </div>
    </div>
  )
}

function CrosswordMock() {
  const blocked = new Set(["0,2", "2,0", "2,4", "4,2"])
  const selectedRow = 1
  return (
    <div className="inline-grid grid-cols-5 gap-0.5" style={{ background: "var(--grid-border)" }}>
      {Array.from({ length: 25 }).map((_, i) => {
        const r = Math.floor(i / 5), c = i % 5
        const isBlocked = blocked.has(`${r},${c}`)
        const isSelected = r === selectedRow && c === 2
        const isHighlighted = r === selectedRow && !isBlocked && !isSelected
        const bg = isBlocked ? "var(--cell-blocked)" : isSelected ? "var(--selection)" : isHighlighted ? "var(--highlight)" : "var(--cell-bg)"
        return (
          <div
            key={i}
            className="w-8 h-8 flex items-center justify-center text-sm font-semibold"
            style={{ background: bg, color: "var(--text)" }}
          >
            {!isBlocked && String.fromCharCode(65 + (i % 26))}
          </div>
        )
      })}
    </div>
  )
}

function WordsearchMock() {
  return (
    <div className="inline-grid grid-cols-6 gap-0.5" style={{ background: "var(--grid-border)" }}>
      {Array.from({ length: 36 }).map((_, i) => (
        <div
          key={i}
          className="w-8 h-8 flex items-center justify-center text-sm"
          style={{
            background: i >= 8 && i <= 12 ? "var(--selection)" : "var(--cell-bg)",
            color: "var(--text)",
          }}
        >
          {String.fromCharCode(65 + (i % 26))}
        </div>
      ))}
    </div>
  )
}

function WordgameMock() {
  return (
    <div className="flex flex-col gap-1">
      {["CRANE", "SPARK", "BRAVE"].map((word, r) => (
        <div key={r} className="flex gap-1">
          {word.split("").map((ch, c) => {
            const bg = c === 0 && r === 0 ? "var(--correct)"
              : c === 2 && r === 1 ? "var(--present)"
              : r < 2 ? "var(--absent)"
              : "var(--cell-bg)"
            const color = r < 2 ? "white" : "var(--text)"
            return (
              <div
                key={c}
                className="w-10 h-10 flex items-center justify-center text-sm font-bold border"
                style={{ background: bg, color, borderColor: "var(--border)" }}
              >
                {ch}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
