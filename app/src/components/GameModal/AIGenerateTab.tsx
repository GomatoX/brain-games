"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { GameType } from "@/lib/game-types"

type AIGenerateTabProps = {
  type: GameType
  mainWord: string
  topic: string
  difficulty: string
  existingWordsCount: number
  onWordsGenerated: (
    words: { word: string; clue: string; main_word_index?: number }[],
  ) => void
}

export const AIGenerateTab = ({
  type,
  mainWord,
  topic,
  difficulty,
  existingWordsCount,
  onWordsGenerated,
}: AIGenerateTabProps) => {
  const [loading, setLoading] = useState(false)
  const [wordCount, setWordCount] = useState(() => {
    const d = difficulty.toLowerCase()
    return d === "easy" ? 5 : d === "hard" ? 12 : 8
  })
  const [language, setLanguage] = useState<"lt" | "en">("lt")

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainWord: mainWord.trim() || topic.trim(),
          wordCount,
          difficulty,
          language,
          topic: topic.trim(),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Generation failed")
      }
      const { words } = await res.json()
      onWordsGenerated(words)
      toast.success(
        `Generated ${words.length} word${words.length === 1 ? "" : "s"}`,
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  const contextLabel =
    type === "crosswords"
      ? mainWord.trim() || topic.trim() || "a crossword"
      : topic.trim() || "a word search"

  return (
    <div className="space-y-5">
      {/* Context info */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
          AI will generate words for
        </div>
        <p className="text-sm font-medium">
          {contextLabel}
        </p>
        {existingWordsCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {existingWordsCount} word{existingWordsCount === 1 ? "" : "s"}{" "}
            already added — duplicates will be skipped.
          </p>
        )}
      </div>

      {/* Word count slider */}
      <Field>
        <div className="flex items-center justify-between">
          <FieldLabel>Number of words</FieldLabel>
          <span className="text-xs font-mono font-bold text-primary">
            {wordCount}
          </span>
        </div>
        <Slider
          aria-label="Number of words"
          min={3}
          max={20}
          value={[wordCount]}
          onValueChange={(v) => setWordCount(v[0])}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground -mt-1">
          <span>3</span>
          <span>20</span>
        </div>
      </Field>

      {/* Language */}
      <Field>
        <FieldLabel>Language</FieldLabel>
        <ToggleGroup
          type="single"
          variant="outline"
          value={language}
          onValueChange={(v) => {
            if (v) setLanguage(v as "lt" | "en")
          }}
          className="w-full"
        >
          <ToggleGroupItem
            value="lt"
            className="flex-1"
            aria-label="Lithuanian"
          >
            🇱🇹 Lithuanian
          </ToggleGroupItem>
          <ToggleGroupItem
            value="en"
            className="flex-1"
            aria-label="English"
          >
            🇬🇧 English
          </ToggleGroupItem>
        </ToggleGroup>
      </Field>

      {/* Generate button */}
      <Button
        type="button"
        variant="gradient"
        onClick={handleGenerate}
        disabled={loading}
        className="w-full h-auto py-2.5"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Generate {wordCount} words
          </>
        )}
      </Button>
    </div>
  )
}
