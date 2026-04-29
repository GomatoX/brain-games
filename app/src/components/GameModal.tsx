"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Loader2,
  X,
  Sparkles,
  Grid3x3,
  Copy,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wand2,
} from "lucide-react"
import { toast } from "sonner"
import type { Game, GameType } from "@/lib/game-types"

const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play"
const API_URL = typeof window !== "undefined" ? window.location.origin : ""

const typeLabels: Record<GameType, string> = {
  crosswords: "Crossword",
  wordgames: "Word Game",
  sudoku: "Sudoku",
  wordsearches: "Word Search",
}

export const GameModal = ({
  mode,
  type,
  game,
  orgId,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit"
  type: GameType
  game?: Game
  orgId: string
  onClose: () => void
  onSaved: () => void
}) => {
  const [saving, setSaving] = useState(false)
  const [createdGame, setCreatedGame] = useState<{
    id: string | number
    title: string
  } | null>(null)
  const [embedCopied, setEmbedCopied] = useState(false)

  // Form fields
  const [title, setTitle] = useState(game?.title || "")
  const [status, setStatus] = useState(game?.status || "draft")
  const [scheduledDate, setScheduledDate] = useState(
    game?.scheduled_date || "",
  )
  const [difficulty, setDifficulty] = useState(game?.difficulty || "Medium")
  // Word game fields
  const [word, setWord] = useState(game?.word || "")
  const [definition, setDefinition] = useState(game?.definition || "")
  const [maxAttempts, setMaxAttempts] = useState(game?.max_attempts || 6)
  // Crossword words
  const [wordsInput, setWordsInput] = useState("")
  const [clueInput, setClueInput] = useState("")
  const [mainWord, setMainWord] = useState(game?.main_word || "")
  const [wordsList, setWordsList] = useState<
    {
      word: string
      clue: string
      main_word_index?: number
      x?: number
      y?: number
      direction?: string
    }[]
  >(game?.words || [])
  // AI generation state
  const [aiLoading, setAiLoading] = useState(false)
  const [layoutLoading, setLayoutLoading] = useState(false)
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false)
  const [aiWordCount, setAiWordCount] = useState(() => {
    const d = difficulty.toLowerCase()
    return d === "easy" ? 5 : d === "hard" ? 12 : 8
  })
  const [aiLanguage, setAiLanguage] = useState<"lt" | "en">("lt")
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
        if (Array.isArray(data)) {
          setBrandingPresets(data)
        }
      })
      .catch(() => {})

    // Pre-select default branding when creating a new game
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

  const handleGenerateWithAI = async () => {
    if (!mainWord.trim()) return
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainWord: mainWord.trim(),
          wordCount: aiWordCount,
          difficulty,
          language: aiLanguage,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Generation failed")
      }
      const { words } = await res.json()
      // Merge: add AI words that don't already exist
      const existing = new Set(wordsList.map((w) => w.word))
      const newWords = words
        .filter((w: { word: string; clue: string }) => !existing.has(w.word))
        .map((w: { word: string; clue: string }) => ({
          word: w.word,
          clue: w.clue,
          main_word_index: undefined as number | undefined,
        }))

      // Auto-assign main_word_index: match each main word letter to a word
      const mw = mainWord.trim().toUpperCase()
      const allWords = [...wordsList, ...newWords]
      const usedWordIndices = new Set<number>()

      for (let mi = 0; mi < mw.length; mi++) {
        const letter = mw[mi]
        // Find a word that contains this letter and hasn't been assigned yet
        for (let wi = 0; wi < allWords.length; wi++) {
          if (usedWordIndices.has(wi)) continue
          if (allWords[wi].main_word_index !== undefined) continue
          const letterIdx = allWords[wi].word.indexOf(letter)
          if (letterIdx !== -1) {
            allWords[wi].main_word_index = letterIdx
            usedWordIndices.add(wi)
            break
          }
        }
      }

      setWordsList(allWords)
      setAiSettingsOpen(false)
      toast.success(`Generated ${newWords.length} word${newWords.length === 1 ? "" : "s"}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setAiLoading(false)
    }
  }

  const handleGenerateLayoutWithAI = async () => {
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
      if (data.words) {
        setWordsList(data.words)
      }
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

  const handleGenerateLayoutWithGemini = async () => {
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
      if (data.words) {
        setWordsList(data.words)
      }
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

  const handleAddWord = () => {
    const w = wordsInput.trim().toUpperCase()
    if (w && !wordsList.some((entry) => entry.word === w)) {
      setWordsList([
        ...wordsList,
        {
          word: w,
          clue: clueInput.trim() || `Clue for ${w}`,
          main_word_index: undefined,
        },
      ])
      setWordsInput("")
      setClueInput("")
    }
  }

  const removeWord = (w: string) => {
    setWordsList(wordsList.filter((entry) => entry.word !== w))
  }

  const getEmbedCode = (gameId: string | number): string => {
    const tagMap: Record<GameType, { tag: string; script: string }> = {
      crosswords: {
        tag: "crossword-game",
        script: `${PLAY_BASE}/dist/crossword-engine.iife.js`,
      },
      wordgames: {
        tag: "word-game",
        script: `${PLAY_BASE}/dist/word-game.iife.js`,
      },
      sudoku: {
        tag: "sudoku-game",
        script: `${PLAY_BASE}/dist/sudoku-engine.iife.js`,
      },
      wordsearches: {
        tag: "word-search-game",
        script: `${PLAY_BASE}/dist/word-search-engine.iife.js`,
      },
    }
    const { tag, script } = tagMap[type]
    return `<script src="${script}"><\/script>

<${tag}
  puzzle-id="${gameId}"
  api-url="${API_URL}"
  user-id="${orgId}"
  theme="light"></${tag}>`
  }

  const handleCopyEmbed = () => {
    if (!createdGame) return
    navigator.clipboard.writeText(getEmbedCode(createdGame.id))
    setEmbedCopied(true)
    toast.success("Embed code copied")
    setTimeout(() => setEmbedCopied(false), 2000)
  }

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
            if (w.main_word_index !== undefined) {
              entry.main_word_index = w.main_word_index
            }
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
        toast.success(`${typeLabels[type]} updated`)
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

  // Success view with embed code
  if (createdGame) {
    return (
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) onClose()
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{`${typeLabels[type]} Created!`}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">
                &ldquo;{createdGame.title}&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                ID: {createdGame.id}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 gap-2">
              <Label>Embed Code</Label>
              <Button size="sm" variant="secondary" onClick={handleCopyEmbed}>
                {embedCopied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                {embedCopied ? "Copied!" : "Copy Snippet"}
              </Button>
            </div>
            <pre className="bg-slate-900 text-slate-300 rounded-md p-4 text-xs overflow-x-auto leading-relaxed">
              <code>{getEmbedCode(createdGame.id)}</code>
            </pre>
          </div>
          <p className="text-xs text-muted-foreground mb-5">
            Paste this snippet into your website&apos;s HTML to display the
            game.
          </p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose()
      }}
    >
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{`${mode === "create" ? "Create" : "Edit"} ${typeLabels[type]}`}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <Label htmlFor="game-title" className="mb-1.5">
              Title
            </Label>
            <Input
              id="game-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Game title"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <Label htmlFor="game-status" className="mb-1.5">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                if (value !== "scheduled") {
                  setScheduledDate("")
                }
              }}
            >
              <SelectTrigger id="game-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Scheduled Date */}
          {status === "scheduled" && (
            <div className="mb-4">
              <Label htmlFor="scheduled-date" className="mb-1.5">
                Publish Date &amp; Time
              </Label>
              <Input
                id="scheduled-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                required
                aria-label="Schedule publish date and time"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                The game will automatically become public at this date and time.
              </p>
            </div>
          )}

          {/* Difficulty (crosswords / sudoku / wordsearches) */}
          {(type === "crosswords" ||
            type === "sudoku" ||
            type === "wordsearches") && (
            <div className="mb-4">
              <Label htmlFor="game-difficulty" className="mb-1.5">
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="game-difficulty" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Branding Preset */}
          <div className="mb-4">
            <Label htmlFor="game-branding" className="mb-1.5">
              Branding Preset{" "}
              <span className="text-xs text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Select
              value={selectedBranding || "none"}
              onValueChange={(value) =>
                setSelectedBranding(value === "none" ? "" : value)
              }
            >
              <SelectTrigger id="game-branding" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Default (no branding)</SelectItem>
                {brandingPresets.map((p) => (
                  <SelectItem key={String(p.id)} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Crossword — Words + Clues */}
          {type === "crosswords" && (
            <>
              {/* Main Word */}
              <div className="mb-4">
                <Label htmlFor="main-word" className="mb-1.5">
                  Main Word{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    (hidden word players discover)
                  </span>
                </Label>
                <Input
                  id="main-word"
                  type="text"
                  value={mainWord}
                  onChange={(e) => setMainWord(e.target.value)}
                  className="font-mono uppercase"
                  placeholder="e.g. BRAIN"
                />
              </div>

              {/* AI Generation */}
              <div className="mb-4">
                {mainWord.trim() && (
                  <>
                    <button
                      type="button"
                      onClick={() => setAiSettingsOpen(!aiSettingsOpen)}
                      disabled={aiLoading}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-rust to-rust-dark text-white rounded-lg text-sm font-medium transition-all hover:shadow-md hover:shadow-rust/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Generating…
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4" />
                          Generate with AI
                          {aiSettingsOpen ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </>
                      )}
                    </button>

                    {aiSettingsOpen && !aiLoading && (
                      <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-border space-y-3">
                        {/* Word Count */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs">
                              Number of words
                            </Label>
                            <span className="text-xs font-mono font-bold text-rust">
                              {aiWordCount}
                            </span>
                          </div>
                          <Slider
                            aria-label="Number of words"
                            min={3}
                            max={20}
                            value={[aiWordCount]}
                            onValueChange={(v) => setAiWordCount(v[0])}
                          />
                          <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                            <span>3</span>
                            <span>20</span>
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <Label className="text-xs block mb-1">
                            Language
                          </Label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setAiLanguage("lt")}
                              aria-pressed={aiLanguage === "lt"}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                aiLanguage === "lt"
                                  ? "bg-rust text-white border-rust"
                                  : "bg-white text-[#0f172a] border-border hover:border-rust"
                              }`}
                            >
                              🇱🇹 Lithuanian
                            </button>
                            <button
                              type="button"
                              onClick={() => setAiLanguage("en")}
                              aria-pressed={aiLanguage === "en"}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                aiLanguage === "en"
                                  ? "bg-rust text-white border-rust"
                                  : "bg-white text-[#0f172a] border-border hover:border-rust"
                              }`}
                            >
                              🇬🇧 English
                            </button>
                          </div>
                        </div>

                        {/* Generate Action */}
                        <Button
                          type="button"
                          onClick={handleGenerateWithAI}
                          className="w-full bg-[#0f172a] hover:bg-[#1e293b]"
                        >
                          Generate {aiWordCount} words
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Words & Clues */}
              <div className="mb-4">
                <Label className="mb-1.5">Words &amp; Clues</Label>
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={wordsInput}
                      onChange={(e) => setWordsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddWord()
                        }
                      }}
                      className="w-36 font-mono uppercase"
                      placeholder="Word"
                    />
                    <Input
                      type="text"
                      value={clueInput}
                      onChange={(e) => setClueInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddWord()
                        }
                      }}
                      className="flex-1"
                      placeholder="Clue (optional)"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddWord}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                {wordsList.length > 0 && (
                  <div className="border border-border rounded-lg divide-y divide-border mb-2">
                    {wordsList.map((entry, idx) => (
                      <div key={idx} className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={entry.word}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                word: e.target.value.toUpperCase(),
                              }
                              setWordsList(updated)
                            }}
                            className="text-xs font-mono font-bold text-[#0f172a] w-24 shrink-0 px-1.5 py-1 border border-transparent hover:border-border focus:border-ring focus:outline-none rounded bg-transparent uppercase"
                          />
                          <input
                            type="text"
                            value={entry.clue}
                            onChange={(e) => {
                              const updated = [...wordsList]
                              updated[idx] = {
                                ...updated[idx],
                                clue: e.target.value,
                              }
                              setWordsList(updated)
                            }}
                            className="text-xs text-muted-foreground flex-1 px-1.5 py-1 border border-transparent hover:border-border focus:border-ring focus:outline-none rounded bg-transparent"
                            placeholder="Clue"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeWord(entry.word)}
                            className="text-muted-foreground hover:text-red-500 size-6"
                            aria-label={`Remove ${entry.word}`}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                        {/* Letter picker for main word */}
                        {mainWord && (
                          <div className="flex gap-1 mt-1.5">
                            {entry.word.split("").map((letter, letterIdx) => {
                              const isSelected =
                                entry.main_word_index === letterIdx
                              return (
                                <button
                                  key={letterIdx}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...wordsList]
                                    updated[idx] = {
                                      ...updated[idx],
                                      main_word_index: isSelected
                                        ? undefined
                                        : letterIdx,
                                    }
                                    setWordsList(updated)
                                  }}
                                  className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded border transition-all ${
                                    isSelected
                                      ? "bg-rust text-white border-rust ring-2 ring-rust/30"
                                      : "bg-white text-[#0f172a] border-border hover:border-rust hover:bg-rust-light"
                                  }`}
                                  title={`Select letter "${letter}" for main word`}
                                >
                                  {letter}
                                </button>
                              )
                            })}
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
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {wordsList.length} word{wordsList.length !== 1 ? "s" : ""}{" "}
                    added
                    {mode === "create" && wordsList.length < 2 && (
                      <span className="text-amber-600 ml-1">
                        (min 2 required)
                      </span>
                    )}
                    {wordsList.some(
                      (w) => w.x !== undefined && w.y !== undefined,
                    ) && (
                      <span className="text-green-600 ml-1">
                        ✓ Layout ready
                      </span>
                    )}
                  </p>
                  {wordsList.length >= 2 && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleGenerateLayoutWithAI}
                        disabled={layoutLoading}
                      >
                        {layoutLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Grid3x3 className="size-4" />
                        )}
                        Layout
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleGenerateLayoutWithGemini}
                        disabled={layoutLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {layoutLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Wand2 className="size-4" />
                        )}
                        AI Layout
                      </Button>
                    </div>
                  )}
                </div>
                {/* Mini Map Preview */}
                {wordsList.some(
                  (w) => w.x !== undefined && w.y !== undefined,
                ) && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        Layout Preview
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setWordsList(
                            wordsList.map((w) => ({
                              ...w,
                              x: undefined,
                              y: undefined,
                              direction: undefined,
                            })),
                          )
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="size-3" />
                        Discard Layout
                      </Button>
                    </div>
                    {(() => {
                      const positioned = wordsList.filter(
                        (w) =>
                          w.x !== undefined &&
                          w.y !== undefined &&
                          w.direction,
                      )
                      if (!positioned.length) return null

                      // Build grid
                      const grid: Record<
                        string,
                        { letter: string; number?: number }
                      > = {}
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
                      const cellSize = Math.min(
                        20,
                        Math.floor(280 / Math.max(cols, rows)),
                      )

                      return (
                        <div
                          className="border border-border rounded-lg p-2 bg-slate-50 overflow-auto max-h-[220px]"
                        >
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
                                    style={{
                                      width: cellSize,
                                      height: cellSize,
                                    }}
                                    className={`flex items-center justify-center relative ${
                                      cell
                                        ? "bg-white border border-[#cbd5e1]"
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
                                          className="font-mono font-bold text-[#0f172a]"
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
                      )
                    })()}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Word Search fields */}
          {type === "wordsearches" && (
            <div className="mb-4">
              <Label className="mb-1.5">Words to Find</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  type="text"
                  value={wordsInput}
                  onChange={(e) => setWordsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const w = wordsInput.trim().toUpperCase()
                      if (
                        w &&
                        !wordsList.some((entry) => entry.word === w)
                      ) {
                        setWordsList([
                          ...wordsList,
                          { word: w, clue: clueInput.trim() || "" },
                        ])
                        setWordsInput("")
                        setClueInput("")
                      }
                    }
                  }}
                  className="w-36 font-mono uppercase"
                  placeholder="Word"
                  aria-label="Word to add"
                />
                <Input
                  type="text"
                  value={clueInput}
                  onChange={(e) => setClueInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const w = wordsInput.trim().toUpperCase()
                      if (
                        w &&
                        !wordsList.some((entry) => entry.word === w)
                      ) {
                        setWordsList([
                          ...wordsList,
                          { word: w, clue: clueInput.trim() || "" },
                        ])
                        setWordsInput("")
                        setClueInput("")
                      }
                    }
                  }}
                  className="flex-1"
                  placeholder="Hint (optional)"
                  aria-label="Hint for the word"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const w = wordsInput.trim().toUpperCase()
                    if (
                      w &&
                      !wordsList.some((entry) => entry.word === w)
                    ) {
                      setWordsList([
                        ...wordsList,
                        { word: w, clue: clueInput.trim() || "" },
                      ])
                      setWordsInput("")
                      setClueInput("")
                    }
                  }}
                  aria-label="Add word"
                >
                  Add
                </Button>
              </div>
              {wordsList.length > 0 && (
                <div className="border border-border rounded-lg divide-y divide-border mb-2">
                  {wordsList.map((entry, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-2 flex items-center gap-3"
                    >
                      <span className="text-xs font-mono font-bold text-[#0f172a] w-24 shrink-0 uppercase">
                        {entry.word}
                      </span>
                      <span className="text-xs text-muted-foreground flex-1 truncate">
                        {entry.clue || "—"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setWordsList(wordsList.filter((_, i) => i !== idx))
                        }
                        className="text-muted-foreground hover:text-red-500 size-6"
                        aria-label={`Remove word ${entry.word}`}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {wordsList.length} word{wordsList.length !== 1 ? "s" : ""}{" "}
                added
                {mode === "create" && wordsList.length < 3 && (
                  <span className="text-amber-600 ml-1">
                    (min 3 required)
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Word Game fields */}
          {type === "wordgames" && (
            <>
              <div className="mb-4">
                <Label htmlFor="word-game-word" className="mb-1.5">
                  Word
                </Label>
                <Input
                  id="word-game-word"
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="font-mono uppercase"
                  placeholder="e.g. HELLO"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="word-game-definition" className="mb-1.5">
                  Definition / Hint
                </Label>
                <Textarea
                  id="word-game-definition"
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  rows={2}
                  placeholder="Optional hint for the player"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="word-game-attempts" className="mb-1.5">
                  Max Attempts
                </Label>
                <Input
                  id="word-game-attempts"
                  type="number"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="w-24"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
