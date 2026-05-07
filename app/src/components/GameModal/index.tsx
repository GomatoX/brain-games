"use client"

import { useState, useEffect } from "react"

import { ModalShell } from "@/components/ui/ModalShell"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { Game, GameType } from "@/lib/game-types"
import { ContentTab } from "./ContentTab"
import { AIGenerateTab } from "./AIGenerateTab"
import { SettingsTab } from "./SettingsTab"
import { SuccessView } from "./SuccessView"
import type { WordEntry } from "./WordChipList"

const TYPE_LABELS: Record<GameType, string> = {
  crosswords: "Crossword",
  wordgames: "Word Game",
  sudoku: "Sudoku",
  wordsearches: "Word Search",
}

const SUBTITLES: Record<GameType, string> = {
  crosswords:
    "Start with a topic and let Cluemaster suggest words and clues — refine each one inline.",
  wordgames: "Define the puzzle players will solve.",
  wordsearches: "Players hunt hidden words inside a letter grid.",
  sudoku: "Configure your puzzle settings.",
}

type GameModalProps = {
  mode: "create" | "edit"
  type: GameType
  game?: Game
  orgId: string
  onClose: () => void
  onSaved: () => void
}

export const GameModal = ({
  mode,
  type,
  game,
  orgId,
  onClose,
  onSaved,
}: GameModalProps) => {
  const [saving, setSaving] = useState(false)
  const [modalTab, setModalTab] = useState<"content" | "ai" | "settings">("content")
  const [createdGame, setCreatedGame] = useState<{
    id: string | number
    title: string
  } | null>(null)

  // ── Form state ──
  const [title, setTitle] = useState(game?.title || "")
  const [status, setStatus] = useState(game?.status || "draft")
  const [scheduledDate, setScheduledDate] = useState(
    game?.scheduled_date || "",
  )
  const [difficulty, setDifficulty] = useState(game?.difficulty || "Medium")
  const [topic, setTopic] = useState("")

  // Word game
  const [word, setWord] = useState(game?.word || "")
  const [definition, setDefinition] = useState(game?.definition || "")
  const [maxAttempts, setMaxAttempts] = useState(game?.max_attempts || 6)

  // Grid size
  const [gridSize, setGridSize] = useState(
    type === "crosswords" ? 13 : type === "wordsearches" ? 12 : 13,
  )

  // Crossword / Wordsearch
  const [mainWord, setMainWord] = useState(game?.main_word || "")
  const [wordsList, setWordsList] = useState<WordEntry[]>(game?.words || [])

  // Layout loading
  const [layoutLoading, setLayoutLoading] = useState(false)

  // Branding
  const [brandingPresets, setBrandingPresets] = useState<
    { id: string | number; name: string }[]
  >([])
  const [selectedBranding, setSelectedBranding] = useState<string>(
    game?.branding ? String(game.branding) : "",
  )

  useEffect(() => {
    fetch("/api/branding")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrandingPresets(data)
      })
      .catch(() => {})

    if (!game) {
      fetch("/api/settings")
        .then((r) => r.json())
        .then((data) => {
          if (data.default_branding) {
            setSelectedBranding(String(data.default_branding))
          }
        })
        .catch(() => {})
    }
  }, [game])

  // ── AI word generation handler ──
  const handleAIWordsGenerated = (
    aiWords: { word: string; clue: string; main_word_index?: number }[],
  ) => {
    const existing = new Set(wordsList.map((w) => w.word))
    const newWords = aiWords
      .filter((w) => !existing.has(w.word))
      .map((w) => ({
        word: w.word,
        clue: w.clue,
        main_word_index: undefined as number | undefined,
      }))

    // Auto-assign main_word_index for crosswords
    const mw = mainWord.trim().toUpperCase()
    const allWords = [...wordsList, ...newWords]
    const usedIndices = new Set<number>()

    for (let mi = 0; mi < mw.length; mi++) {
      const letter = mw[mi]
      for (let wi = 0; wi < allWords.length; wi++) {
        if (usedIndices.has(wi)) continue
        if (allWords[wi].main_word_index !== undefined) continue
        const letterIdx = allWords[wi].word.indexOf(letter)
        if (letterIdx !== -1) {
          allWords[wi].main_word_index = letterIdx
          usedIndices.add(wi)
          break
        }
      }
    }

    setWordsList(allWords)
  }

  // ── Layout generators ──
  const handleGenerateLayout = async () => {
    if (wordsList.length < 2) return
    setLayoutLoading(true)
    try {
      const res = await fetch("/api/ai/layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsList }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Layout generation failed")
      }
      const data = await res.json()
      if (data.words) setWordsList(data.words)
      if (data.stats) {
        toast.success(
          `${data.stats.density}% density, ${data.stats.wordsPlaced}/${data.stats.totalWords} words, balance ${data.stats.balance}`,
        )
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Layout generation failed",
      )
    } finally {
      setLayoutLoading(false)
    }
  }

  const handleGenerateLayoutAI = async () => {
    if (wordsList.length < 2) return
    setLayoutLoading(true)
    try {
      const res = await fetch("/api/ai/layout-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ words: wordsList }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "AI layout generation failed")
      }
      const data = await res.json()
      if (data.words) setWordsList(data.words)
      const validLabel = data.valid ? "Valid" : "Has conflicts"
      if (data.stats) {
        const message = `${validLabel} | AI Layout: ${data.stats.density}% density, ${data.stats.wordsPlaced}/${data.stats.totalWords} words`
        if (data.valid) {
          toast.success(message)
        } else {
          toast.error(message)
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "AI layout generation failed",
      )
    } finally {
      setLayoutLoading(false)
    }
  }

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const baseData: Record<string, unknown> = {
        collection: type,
        title,
        status,
        branding: selectedBranding || null,
        scheduled_date:
          status === "scheduled" && scheduledDate
            ? new Date(scheduledDate).toISOString()
            : null,
      }

      if (type === "crosswords") {
        if (mode === "create" && wordsList.length < 2) {
          toast.error("Add at least 2 words for the crossword")
          setSaving(false)
          return
        }
        baseData.difficulty = difficulty
        if (mainWord.trim()) {
          baseData.main_word = mainWord.trim().toUpperCase()
        }
        if (wordsList.length > 0) {
          baseData.words = wordsList.map((w) => {
            const entry: Record<string, unknown> = {
              word: w.word,
              clue: w.clue,
            }
            if (w.main_word_index !== undefined)
              entry.main_word_index = w.main_word_index
            if (w.x !== undefined) entry.x = w.x
            if (w.y !== undefined) entry.y = w.y
            if (w.direction) entry.direction = w.direction
            return entry
          })
        }
      } else if (type === "wordgames") {
        if (!word) {
          toast.error("Word is required")
          setSaving(false)
          return
        }
        baseData.word = word.toUpperCase()
        baseData.definition = definition
        baseData.max_attempts = maxAttempts
      } else if (type === "wordsearches") {
        if (mode === "create" && wordsList.length < 3) {
          toast.error("Add at least 3 words for the word search")
          setSaving(false)
          return
        }
        baseData.difficulty = difficulty
        if (wordsList.length > 0) {
          baseData.words = wordsList.map((w) => ({
            word: w.word,
            clue: w.clue,
          }))
        }
      } else if (type === "sudoku") {
        baseData.difficulty = difficulty
      }

      if (mode === "edit" && game) {
        baseData.id = game.id
        const res = await fetch("/api/games", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(baseData),
        })
        if (!res.ok) throw new Error("Failed to save")
        toast.success(`${TYPE_LABELS[type]} updated`)
        onSaved()
        onClose()
      } else {
        const res = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(baseData),
        })
        if (!res.ok) throw new Error("Failed to save")
        const result = await res.json()
        onSaved()
        setCreatedGame({ id: result.data?.id || result.id, title })
      }
    } catch {
      toast.error("Failed to save game")
    } finally {
      setSaving(false)
    }
  }

  // ── Success view ──
  if (createdGame) {
    return (
      <SuccessView
        type={type}
        gameId={createdGame.id}
        gameTitle={createdGame.title}
        orgId={orgId}
        onClose={onClose}
      />
    )
  }

  const hasAI = type === "crosswords" || type === "wordsearches"

  const sparkleIcon = (
    <svg width="9" height="9" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M7 1.5l1.4 3.1 3.1 1.4-3.1 1.4L7 10.5 5.6 7.4 2.5 6l3.1-1.4L7 1.5z"
        fill="currentColor"
      />
    </svg>
  )

  const tabs = [
    {
      id: "content",
      label:
        type === "crosswords"
          ? "Words & clues"
          : type === "wordsearches"
            ? "Words"
            : "Content",
      step: 1,
    },
    ...(hasAI
      ? [
          {
            id: "ai",
            label: "AI generate",
            icon: sparkleIcon,
          },
        ]
      : []),
    { id: "settings", label: "Settings", step: 2 },
  ]

  const footer = (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-end gap-2 w-full"
    >
      {modalTab === "content" ? (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalTab("settings")}
          >
            Next: Settings
          </Button>
        </>
      ) : modalTab === "ai" ? (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setModalTab("content")}
          >
            Back to words
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalTab("settings")}
          >
            Next: Settings
          </Button>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setModalTab("content")}
          >
            Back
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving
              ? "Saving…"
              : mode === "create"
                ? type === "crosswords"
                  ? "Create puzzle"
                  : "Create game"
                : "Save Changes"}
          </Button>
        </>
      )}
    </form>
  )

  return (
    <ModalShell
      open
      onClose={onClose}
      title={`${mode === "create" ? "Create" : "Edit"} ${TYPE_LABELS[type]}`}
      subtitle={SUBTITLES[type]}
      tabs={tabs}
      activeTab={modalTab}
      onTabChange={(id) => setModalTab(id as "content" | "ai" | "settings")}
      footer={footer}
      saving={saving}
    >
      {modalTab === "content" && (
        <ContentTab
          type={type}
          mode={mode}
          title={title}
          onTitleChange={setTitle}
          topic={topic}
          onTopicChange={setTopic}
          wordsList={wordsList}
          onWordsListChange={setWordsList}
          mainWord={mainWord}
          onMainWordChange={setMainWord}
          difficulty={difficulty}
          word={word}
          onWordChange={setWord}
          definition={definition}
          onDefinitionChange={setDefinition}
          gridSize={gridSize}
        />
      )}
      {modalTab === "ai" && hasAI && (
        <AIGenerateTab
          type={type}
          mainWord={mainWord}
          topic={topic}
          difficulty={difficulty}
          existingWordsCount={wordsList.length}
          onWordsGenerated={handleAIWordsGenerated}
        />
      )}
      {modalTab === "settings" && (
        <SettingsTab
          type={type}
          status={status}
          onStatusChange={setStatus}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          scheduledDate={scheduledDate}
          onScheduledDateChange={setScheduledDate}
          brandingPresets={brandingPresets}
          selectedBranding={selectedBranding}
          onBrandingChange={setSelectedBranding}
          maxAttempts={maxAttempts}
          onMaxAttemptsChange={setMaxAttempts}
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
        />
      )}
    </ModalShell>
  )
}
