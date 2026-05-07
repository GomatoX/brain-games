"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { WordEntry } from "./WordChipList"

type LayoutPreviewProps = {
  words: WordEntry[]
  onDiscard: () => void
}

export const LayoutPreview = ({ words, onDiscard }: LayoutPreviewProps) => {
  const positioned = words.filter(
    (w) => w.x !== undefined && w.y !== undefined && w.direction,
  )

  if (!positioned.length) return null

  // Build grid
  const grid: Record<string, { letter: string; number?: number }> = {}
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity

  positioned.forEach((w, idx) => {
    const dx = w.direction === "across" ? 1 : 0
    const dy = w.direction === "down" ? 1 : 0
    for (let i = 0; i < w.word.length; i++) {
      const cx = w.x! + i * dx
      const cy = w.y! + i * dy
      const key = `${cx},${cy}`
      if (!grid[key]) {
        grid[key] = { letter: w.word[i] }
      }
      if (i === 0) {
        grid[key].number = idx + 1
      }
      minX = Math.min(minX, cx)
      minY = Math.min(minY, cy)
      maxX = Math.max(maxX, cx)
      maxY = Math.max(maxY, cy)
    }
  })

  const cols = maxX - minX + 1
  const rows = maxY - minY + 1
  const cellSize = Math.min(20, Math.floor(280 / Math.max(cols, rows)))

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Layout Preview
        </span>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={onDiscard}
          className="text-red-500 hover:text-red-700"
        >
          <X className="size-3" />
          Discard Layout
        </Button>
      </div>
      <div className="border border-border rounded-lg p-2 bg-[var(--tool-surface-2)] overflow-auto max-h-[220px]">
        <div
          className="mx-auto"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
            gap: "1px",
            width: "fit-content",
          }}
        >
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: cols }, (_, col) => {
              const key = `${col + minX},${row + minY}`
              const cell = grid[key]
              return (
                <div
                  key={key}
                  style={{ width: cellSize, height: cellSize }}
                  className={`flex items-center justify-center relative ${
                    cell
                      ? "bg-white border border-[var(--tool-border-strong)]"
                      : "bg-transparent"
                  }`}
                >
                  {cell && (
                    <>
                      {cell.number && (
                        <span
                          className="absolute text-muted-foreground font-bold leading-none"
                          style={{
                            fontSize: `${Math.max(5, cellSize * 0.3)}px`,
                            top: 0,
                            left: 1,
                          }}
                        >
                          {cell.number}
                        </span>
                      )}
                      <span
                        className="font-mono font-bold text-[var(--tool-text)]"
                        style={{
                          fontSize: `${Math.max(6, cellSize * 0.45)}px`,
                        }}
                      >
                        {cell.letter}
                      </span>
                    </>
                  )}
                </div>
              )
            }),
          )}
        </div>
      </div>
    </div>
  )
}
