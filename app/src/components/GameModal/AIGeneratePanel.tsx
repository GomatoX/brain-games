"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

type AIGeneratePanelProps = {
  mainWord: string
  difficulty: string
  onWordsGenerated: (
    words: { word: string; clue: string; main_word_index?: number }[],
  ) => void
}

export const AIGeneratePanel = ({
  mainWord,
  difficulty,
  onWordsGenerated,
}: AIGeneratePanelProps) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [wordCount, setWordCount] = useState(() => {
    const d = difficulty.toLowerCase()
    return d === "easy" ? 5 : d === "hard" ? 12 : 8
  })
  const [language, setLanguage] = useState<"lt" | "en">("lt")

  if (!mainWord.trim()) return null

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainWord: mainWord.trim(),
          wordCount,
          difficulty,
          language,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Generation failed")
      }
      const { words } = await res.json()
      onWordsGenerated(words)
      setOpen(false)
      toast.success(
        `Generated ${words.length} word${words.length === 1 ? "" : "s"}`,
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-4">
      <Button
        type="button"
        variant="gradient"
        onClick={() => setOpen(!open)}
        disabled={loading}
        className="w-full h-auto py-2.5 rounded-lg"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Generate with AI
            {open ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </>
        )}
      </Button>

      {open && !loading && (
        <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-border space-y-4">
          {/* Word Count */}
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

          {/* Generate Action */}
          <Button
            type="button"
            onClick={handleGenerate}
            className="w-full"
          >
            Generate {wordCount} words
          </Button>
        </div>
      )}
    </div>
  )
}
