"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export type WordEntry = {
  word: string
  clue: string
  main_word_index?: number
  x?: number
  y?: number
  direction?: string
}

type WordChipListProps = {
  words: WordEntry[]
  onUpdate: (words: WordEntry[]) => void
  mainWord?: string
  wordPlaceholder?: string
  cluePlaceholder?: string
  clueLabel?: string
  minRequired?: number
  mode?: "create" | "edit"
}

export const WordChipList = ({
  words,
  onUpdate,
  mainWord,
  wordPlaceholder = "Word",
  cluePlaceholder = "Clue (optional)",
  minRequired = 2,
  mode = "create",
}: WordChipListProps) => {
  const [wordInput, setWordInput] = useState("")
  const [clueInput, setClueInput] = useState("")

  const handleAdd = () => {
    const w = wordInput.trim().toUpperCase()
    if (!w || words.some((entry) => entry.word === w)) return

    onUpdate([
      ...words,
      { word: w, clue: clueInput.trim() || `Clue for ${w}` },
    ])
    setWordInput("")
    setClueInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleRemove = (index: number) => {
    onUpdate(words.filter((_, i) => i !== index))
  }

  const handleWordChange = (index: number, value: string) => {
    const updated = [...words]
    updated[index] = { ...updated[index], word: value.toUpperCase() }
    onUpdate(updated)
  }

  const handleClueChange = (index: number, value: string) => {
    const updated = [...words]
    updated[index] = { ...updated[index], clue: value }
    onUpdate(updated)
  }

  const handleMainWordIndex = (index: number, letterIdx: number | undefined) => {
    const updated = [...words]
    updated[index] = { ...updated[index], main_word_index: letterIdx }
    onUpdate(updated)
  }

  const hasLayout = words.some(
    (w) => w.x !== undefined && w.y !== undefined,
  )

  return (
    <div>
      {/* Add word input row */}
      <div className="flex gap-2 mb-3">
        <Input
          type="text"
          value={wordInput}
          onChange={(e) => setWordInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-36 font-mono uppercase"
          placeholder={wordPlaceholder}
          aria-label="Word to add"
        />
        <Input
          type="text"
          value={clueInput}
          onChange={(e) => setClueInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
          placeholder={cluePlaceholder}
          aria-label="Clue for the word"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          aria-label="Add word"
        >
          Add
        </Button>
      </div>

      {/* Word list */}
      {words.length > 0 && (
        <div className="border border-border rounded-lg divide-y divide-border mb-2">
          {words.map((entry, idx) => (
            <div key={idx} className="px-3 py-2">
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={entry.word}
                  onChange={(e) => handleWordChange(idx, e.target.value)}
                  className="h-auto w-24 shrink-0 px-1.5 py-1 text-xs font-mono font-bold uppercase text-[var(--tool-text)] bg-transparent border-transparent shadow-none rounded hover:border-border focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
                  aria-label={`Edit word ${entry.word}`}
                />
                <Input
                  type="text"
                  value={entry.clue}
                  onChange={(e) => handleClueChange(idx, e.target.value)}
                  className="h-auto flex-1 px-1.5 py-1 text-xs text-muted-foreground bg-transparent border-transparent shadow-none rounded hover:border-border focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Clue"
                  aria-label={`Edit clue for ${entry.word}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(idx)}
                  className="text-muted-foreground hover:text-red-500 size-6"
                  aria-label={`Remove ${entry.word}`}
                >
                  <X className="size-3" />
                </Button>
              </div>

              {/* Main word letter picker */}
              {mainWord && (
                <div className="flex gap-1 mt-1.5">
                  <div className="flex gap-1">
                    {entry.word.split("").map((letter, letterIdx) => (
                      <button
                        key={letterIdx}
                        type="button"
                        onClick={() =>
                          handleMainWordIndex(
                            idx,
                            entry.main_word_index === letterIdx
                              ? undefined
                              : letterIdx,
                          )
                        }
                        title={`Select letter "${letter}" for main word`}
                        className={`size-6 p-0 text-xs font-mono font-bold rounded border transition-all ${
                          entry.main_word_index === letterIdx
                            ? "bg-rust text-white border-rust ring-2 ring-rust/30"
                            : "bg-white text-[var(--tool-text)] border-border hover:border-rust hover:bg-rust-light"
                        }`}
                        tabIndex={0}
                        aria-label={`Letter ${letter}`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground ml-1 self-center">
                    {entry.main_word_index !== undefined
                      ? "✓"
                      : "click a letter"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Word count summary */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">
          {words.length} word{words.length !== 1 ? "s" : ""} added
          {mode === "create" && words.length < minRequired && (
            <span className="text-amber-600 ml-1">
              (min {minRequired} required)
            </span>
          )}
          {hasLayout && (
            <span className="text-green-600 ml-1">✓ Layout ready</span>
          )}
        </p>
      </div>
    </div>
  )
}
