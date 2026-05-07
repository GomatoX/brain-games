"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { GameType } from "@/lib/game-types"
import { WordChipList, type WordEntry } from "./WordChipList"

type ContentTabProps = {
  type: GameType
  mode: "create" | "edit"
  // Shared
  title: string
  onTitleChange: (v: string) => void
  // Topic (crosswords)
  topic: string
  onTopicChange: (v: string) => void
  // Crossword + Wordsearch
  wordsList: WordEntry[]
  onWordsListChange: (words: WordEntry[]) => void
  mainWord: string
  onMainWordChange: (v: string) => void
  difficulty: string
  // Word game
  word: string
  onWordChange: (v: string) => void
  definition: string
  onDefinitionChange: (v: string) => void
  // Grid size (for preview context)
  gridSize: number
}

/* ── Word Search preview grid builder ── */
const buildWSPreviewGrid = (words: WordEntry[]) => {
  const rows = 6
  const cols = 8
  const rng = (i: number) => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[(i * 7 + 3) % 26]
  const cells: { ch: string; hl: boolean }[] = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ ch: rng(r * cols + c), hl: false })
    }
  }

  const placements = [
    { row: 1, col: 1 },
    { row: 3, col: 0 },
    { row: 5, col: 2 },
  ]

  words.slice(0, 3).forEach((w, idx) => {
    const p = placements[idx]
    if (!p) return
    ;[...w.word.toUpperCase()].forEach((ch, i) => {
      if (p.col + i >= cols) return
      const cellIdx = p.row * cols + p.col + i
      if (cells[cellIdx]) {
        cells[cellIdx].ch = ch
        cells[cellIdx].hl = true
      }
    })
  })

  return cells
}

/* ── Crossword preview grid builder ── */
const buildCWPreviewGrid = (featuredWord: string) => {
  const SIZE = 7
  const layout = [
    ["b", "", "", "b", "", "", "b"],
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "b"],
    ["b", "", "", "", "", "", ""],
    ["", "", "b", "", "", "", ""],
    ["", "", "", "", "", "", ""],
    ["b", "", "", "b", "", "", "b"],
  ]

  const cells: {
    b: boolean
    main: boolean
    num: number | null
    letter?: string
  }[] = []
  let n = 1
  const mainCells = [
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
  ]

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const isB = layout[r][c] === "b"
      const startsAcross =
        !isB &&
        (c === 0 || layout[r][c - 1] === "b") &&
        c < SIZE - 1 &&
        layout[r][c + 1] !== "b"
      const startsDown =
        !isB &&
        (r === 0 || layout[r - 1][c] === "b") &&
        r < SIZE - 1 &&
        layout[r + 1][c] !== "b"
      const num = startsAcross || startsDown ? n++ : null
      const isMain = mainCells.some(([rr, cc]) => rr === r && cc === c)
      cells.push({ b: isB, main: isMain, num })
    }
  }

  if (featuredWord) {
    const letters = featuredWord.toUpperCase().slice(0, 4).split("")
    cells
      .filter((c) => c.main)
      .forEach((c, i) => {
        c.letter = letters[i] || ""
      })
  }

  return cells
}

export const ContentTab = ({
  type,
  mode,
  title,
  onTitleChange,
  topic,
  onTopicChange,
  wordsList,
  onWordsListChange,
  mainWord,
  onMainWordChange,
  difficulty,
  word,
  onWordChange,
  definition,
  onDefinitionChange,
  gridSize,
}: ContentTabProps) => {
  /* ── Crossword ── */
  if (type === "crosswords") {
    return (
      <CrosswordContent
        mode={mode}
        title={title}
        onTitleChange={onTitleChange}
        topic={topic}
        onTopicChange={onTopicChange}
        wordsList={wordsList}
        onWordsListChange={onWordsListChange}
        mainWord={mainWord}
        onMainWordChange={onMainWordChange}
        gridSize={gridSize}
      />
    )
  }

  /* ── Word Search ── */
  if (type === "wordsearches") {
    return (
      <WordSearchContent
        mode={mode}
        title={title}
        onTitleChange={onTitleChange}
        wordsList={wordsList}
        onWordsListChange={onWordsListChange}
        gridSize={gridSize}
      />
    )
  }

  /* ── Word Game ── */
  return (
    <WordGameContent
      title={title}
      onTitleChange={onTitleChange}
      word={word}
      onWordChange={onWordChange}
      definition={definition}
      onDefinitionChange={onDefinitionChange}
    />
  )
}

/* ──────────────────────────────────────────────
   Word Game — Content tab
   ────────────────────────────────────────────── */

type WordGameContentProps = {
  title: string
  onTitleChange: (v: string) => void
  word: string
  onWordChange: (v: string) => void
  definition: string
  onDefinitionChange: (v: string) => void
}

const WordGameContent = ({
  title,
  onTitleChange,
  word,
  onWordChange,
  definition,
  onDefinitionChange,
}: WordGameContentProps) => {
  const tiles = Array.from({ length: 5 }, (_, i) => word.toUpperCase()[i] || "")

  return (
    <>
      {/* Live preview tile */}
      <div className="preview-tile">
        <span className="preview-tile-label">
          Live preview · {word.trim().length || 5}-letter word
        </span>
        <div className="preview-tile-tiles">
          {tiles.map((c, i) => (
            <div
              key={i}
              className={`preview-tile-tile ${!c ? "empty" : ""}`}
            >
              {c}
            </div>
          ))}
        </div>
      </div>

      <Field>
        <FieldLabel htmlFor="game-title">
          Title
        </FieldLabel>
        <Input
          id="game-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Monday Mini"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="word-game-word">
          Word{" "}
          <span className="font-normal normal-case tracking-normal text-muted-foreground">
            3–5 letters
          </span>
        </FieldLabel>
        <Input
          id="word-game-word"
          type="text"
          value={word}
          onChange={(e) => onWordChange(e.target.value.replace(/[^A-Za-z]/g, ""))}
          className="font-mono uppercase"
          placeholder="HELLO"
          maxLength={5}
          required
        />
        <FieldDescription>
          Players will guess this word. Stored hashed — never visible to
          clients.
        </FieldDescription>
      </Field>

      <Field>
        <FieldLabel
          htmlFor="word-game-definition"
        >
          Definition / Hint{" "}
          <span className="font-normal normal-case tracking-normal text-muted-foreground">
            optional
          </span>
        </FieldLabel>
        <Textarea
          id="word-game-definition"
          value={definition}
          onChange={(e) => onDefinitionChange(e.target.value)}
          rows={2}
          placeholder="A common greeting"
        />
      </Field>
    </>
  )
}

/* ──────────────────────────────────────────────
   Word Search — Content tab
   ────────────────────────────────────────────── */

type WordSearchContentProps = {
  mode: "create" | "edit"
  title: string
  onTitleChange: (v: string) => void
  wordsList: WordEntry[]
  onWordsListChange: (words: WordEntry[]) => void
  gridSize: number
}

const WordSearchContent = ({
  mode,
  title,
  onTitleChange,
  wordsList,
  onWordsListChange,
  gridSize,
}: WordSearchContentProps) => {
  const previewCells = useMemo(
    () => buildWSPreviewGrid(wordsList),
    [wordsList],
  )

  const longestWord =
    wordsList.length > 0
      ? Math.max(...wordsList.map((w) => w.word.length))
      : 0

  return (
    <>
      {/* Word search grid preview */}
      <div className="ws-preview">
        <div className="ws-grid">
          {previewCells.map((c, i) => (
            <div key={i} className={`ws-cell ${c.hl ? "hl" : ""}`}>
              {c.ch}
            </div>
          ))}
        </div>
        <div className="ws-meta">
          <div
            className="font-mono text-[10.5px] uppercase tracking-wider mb-1.5"
            style={{ color: "var(--tool-text-faint)" }}
          >
            Live preview
          </div>
          <strong>{wordsList.length}</strong> words placed
          <br />
          Grid <strong>{gridSize}×{gridSize}</strong>
          {wordsList.length > 0 && (
            <>
              <br />
              Longest: <strong>{longestWord} letters</strong>
            </>
          )}
        </div>
      </div>

      <Field>
        <FieldLabel htmlFor="game-title">
          Title
        </FieldLabel>
        <Input
          id="game-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="e.g. Spring vocabulary"
          required
        />
      </Field>

      <Field>
        <FieldLabel>
          Words to find
          <span
            className="font-normal normal-case tracking-normal ml-auto"
            style={{
              color:
                wordsList.length >= 3
                  ? "var(--tool-good)"
                  : "var(--tool-accent)",
            }}
          >
            {wordsList.length} added ·{" "}
            {wordsList.length >= 3
              ? "✓ ready"
              : `${3 - wordsList.length} more required`}
          </span>
        </FieldLabel>
        <WordChipList
          words={wordsList}
          onUpdate={onWordsListChange}
          wordPlaceholder="Word"
          cluePlaceholder="Hint for player (optional)"
          minRequired={3}
          mode={mode}
        />
      </Field>
    </>
  )
}

/* ──────────────────────────────────────────────
   Crossword — Content tab
   ────────────────────────────────────────────── */

type CrosswordContentProps = {
  mode: "create" | "edit"
  title: string
  onTitleChange: (v: string) => void
  topic: string
  onTopicChange: (v: string) => void
  wordsList: WordEntry[]
  onWordsListChange: (words: WordEntry[]) => void
  mainWord: string
  onMainWordChange: (v: string) => void
  gridSize: number
}

const CrosswordContent = ({
  mode,
  title,
  onTitleChange,
  topic,
  onTopicChange,
  wordsList,
  onWordsListChange,
  mainWord,
  onMainWordChange,
  gridSize,
}: CrosswordContentProps) => {
  const [featured, setFeatured] = useState<number>(-1)

  const featuredWord =
    featured >= 0 ? wordsList[featured]?.word || "" : ""

  const cells = useMemo(() => buildCWPreviewGrid(featuredWord), [featuredWord])

  return (
    <>
      <div className="grid-2">
        <Field>
          <FieldLabel htmlFor="game-title">
            Puzzle title
          </FieldLabel>
          <Input
            id="game-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Friday Cryptic"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="game-topic">
            Topic{" "}
            <span className="font-normal normal-case tracking-normal text-muted-foreground">
              guides AI suggestions
            </span>
          </FieldLabel>
          <Input
            id="game-topic"
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Space exploration, Ancient Rome…"
          />
        </Field>
      </div>

      <div className="cw-edit-grid">
        <div className="cw-edit-words">
          <FieldLabel>
            Words & clues
            <span
              className="font-normal normal-case tracking-normal ml-auto"
              style={{
                color:
                  wordsList.length >= 2
                    ? "var(--tool-good)"
                    : "var(--tool-text-faint)",
              }}
            >
              {wordsList.length === 0
                ? "add at least 2"
                : `${wordsList.length} ${wordsList.length === 1 ? "entry" : "entries"} · ${wordsList.length >= 2 ? "ready" : `${2 - wordsList.length} more`}`}
            </span>
          </FieldLabel>

          <WordChipList
            words={wordsList}
            onUpdate={onWordsListChange}
            mainWord={mainWord}
            minRequired={2}
            mode={mode}
          />

          {wordsList.length === 0 && (
            <div className="words-empty mt-2">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                style={{ opacity: 0.4 }}
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="6"
                  width="18"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
                <rect
                  x="2"
                  y="13"
                  width="18"
                  height="3"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
              <span>
                No words yet — type one above, or use the{" "}
                <strong>AI generate</strong> tab.
              </span>
            </div>
          )}
        </div>

        <div className="cw-edit-preview">
          <div className="cw-preview">
            <div className="cw-grid-preview">
              {cells.map((c, i) => (
                <div
                  key={i}
                  className={`cw-cell ${c.b ? "blocked" : ""} ${c.main ? "main" : ""}`}
                >
                  {c.num && <span className="cw-num">{c.num}</span>}
                  {c.letter || ""}
                </div>
              ))}
            </div>
            <div className="cw-meta">
              <div className="cw-meta-label">Live preview</div>
              <div className="cw-meta-row">
                <span>Entries</span>
                <strong>{wordsList.length}</strong>
              </div>
              <div className="cw-meta-row">
                <span>Featured</span>
                <strong
                  style={{
                    color: featuredWord
                      ? "var(--tool-accent)"
                      : "var(--tool-text-faint)",
                  }}
                >
                  {featuredWord || "—"}
                </strong>
              </div>
              <div className="cw-meta-row">
                <span>Grid</span>
                <strong>
                  {gridSize}×{gridSize}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
