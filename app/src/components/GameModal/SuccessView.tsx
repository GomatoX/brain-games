"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"
import { ModalShell } from "@/components/ui/ModalShell"
import { CheckCircle2, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import type { GameType } from "@/lib/game-types"

const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play"
const API_URL = typeof window !== "undefined" ? window.location.origin : ""

const TYPE_LABELS: Record<GameType, string> = {
  crosswords: "Crossword",
  wordgames: "Word Game",
  sudoku: "Sudoku",
  wordsearches: "Word Search",
}

type SuccessViewProps = {
  type: GameType
  gameId: string | number
  gameTitle: string
  orgId: string
  onClose: () => void
}

export const SuccessView = ({
  type,
  gameId,
  gameTitle,
  orgId,
  onClose,
}: SuccessViewProps) => {
  const [copied, setCopied] = useState(false)

  const getEmbedCode = (): string => {
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

  const handleCopy = () => {
    navigator.clipboard.writeText(getEmbedCode())
    setCopied(true)
    toast.success("Embed code copied")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ModalShell
      open
      onClose={onClose}
      title={`${TYPE_LABELS[type]} Created!`}
      wide={false}
      footer={
        <Button onClick={onClose}>Done</Button>
      }
    >
      <div className="px-5 pb-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="size-5 text-green-600" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">&ldquo;{gameTitle}&rdquo;</p>
            <p className="text-xs text-muted-foreground">ID: {gameId}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 gap-2">
            <FieldLabel>Embed Code</FieldLabel>
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? "Copied!" : "Copy Snippet"}
            </Button>
          </div>
          <pre className="bg-[var(--tool-text)] text-[var(--tool-surface-2)] rounded-md p-4 text-xs overflow-x-auto leading-relaxed">
            <code>{getEmbedCode()}</code>
          </pre>
        </div>

        <p className="text-xs text-muted-foreground mb-2">
          Paste this snippet into your website&apos;s HTML to display the
          game.
        </p>
      </div>
    </ModalShell>
  )
}
