"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Code, Copy, Check, Grid3x3, SpellCheck2, Search } from "lucide-react"
import { toast } from "sonner"
import { GameSection } from "@/components/GameSection"
import { GameModal } from "@/components/GameModal"
import { GamePagination } from "@/components/GamePagination"
import type { Game, GameType } from "@/lib/game-types"

const GAME_HEADERS: Record<
  GameType,
  { Icon: typeof Grid3x3; iconClass: string }
> = {
  crosswords: { Icon: Grid3x3, iconClass: "bg-blue-50 text-blue-600" },
  wordgames: { Icon: SpellCheck2, iconClass: "bg-green-50 text-green-600" },
  wordsearches: { Icon: Search, iconClass: "bg-purple-50 text-purple-600" },
  sudoku: { Icon: Grid3x3, iconClass: "bg-orange-50 text-orange-600" },
}

const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play"
const API_URL = typeof window !== "undefined" ? window.location.origin : ""

interface Props {
  games: Game[]
  type: GameType
  page: number
  totalPages: number
  total: number
  orgId: string
  initialLang: string
  title: string
  basePath: string
}

export const GameListClient = ({
  games,
  type,
  page,
  totalPages,
  total,
  orgId,
  initialLang,
  title,
  basePath,
}: Props) => {
  const { Icon, iconClass } = GAME_HEADERS[type]
  const router = useRouter()
  const [modal, setModal] = useState<{
    open: boolean
    mode: "create" | "edit"
    game?: Game
  }>({ open: false, mode: "create" })
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: GameType
    id: string | number
  } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [embedPopover, setEmbedPopover] = useState<{
    game: Game
    type: GameType
  } | null>(null)
  const [embedCopied, setEmbedCopied] = useState(false)

  const getEmbedSnippet = (gameId: string | number) => {
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
    return `<script src="${script}"><\/script>\n\n<${tag}\n  puzzle-id="${gameId}"\n  api-url="${API_URL}"\n  user-id="${orgId}"\n  lang="${initialLang}"\n  theme="light"></${tag}>`
  }

  const handleCopyEmbedSnippet = (gameId: string | number) => {
    navigator.clipboard.writeText(getEmbedSnippet(gameId))
    setEmbedCopied(true)
    toast.success("Embed code copied")
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const handleExportGameCsv = (game: Game) => {
    const rows: string[][] = []
    if (game.main_word) {
      rows.push(["Main Word", game.main_word])
      rows.push([])
    }
    rows.push(["Word", "Clue"])
    if (game.words) {
      for (const w of game.words) rows.push([w.word, w.clue])
    }
    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n")
    const blob = new Blob(["﻿" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${game.title || "crossword"}-words.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = async (deleteType: GameType, id: string | number) => {
    setDeleting(true)
    try {
      const res = await fetch(
        `/api/games?collection=${deleteType}&id=${id}`,
        { method: "DELETE" },
      )
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Game deleted")
      router.refresh()
    } catch {
      toast.error("Failed to delete game")
    } finally {
      setDeleting(false)
      setDeleteConfirm(null)
    }
  }

  const handleToggleStatus = async (
    toggleType: GameType,
    id: string | number,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    try {
      const res = await fetch("/api/games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: toggleType,
          id,
          status: newStatus,
          scheduled_date: newStatus === "published" ? null : undefined,
        }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(
        newStatus === "published" ? "Game published" : "Game unpublished",
      )
      router.refresh()
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <div>
      <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}
        >
          <Icon className="size-[18px]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] leading-tight">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} total · page {page} of {Math.max(1, totalPages)}
          </p>
        </div>
      </div>

      <GameSection
        title={title}
        games={games}
        type={type}
        onAdd={() => setModal({ open: true, mode: "create" })}
        onEdit={(g) => setModal({ open: true, mode: "edit", game: g })}
        onDelete={(id) => setDeleteConfirm({ type, id })}
        onToggleStatus={handleToggleStatus}
        onShowCode={(g) => setEmbedPopover({ game: g, type })}
        onExportCsv={type === "crosswords" ? handleExportGameCsv : undefined}
        lang={initialLang}
        orgId={orgId}
      />

      <GamePagination
        page={page}
        totalPages={totalPages}
        basePath={basePath}
      />

      {modal.open && (
        <GameModal
          mode={modal.mode}
          type={type}
          game={modal.game}
          orgId={orgId}
          onClose={() => setModal({ open: false, mode: "create" })}
          onSaved={() => {
            setModal({ open: false, mode: "create" })
            router.refresh()
          }}
        />
      )}

      {/* Delete Confirmation */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteConfirm(null)
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Game</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-2">
            Are you sure? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirm &&
                handleDelete(deleteConfirm.type, deleteConfirm.id)
              }
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Embed Code Popover */}
      <Dialog
        open={!!embedPopover}
        onOpenChange={(open) => {
          if (!open) {
            setEmbedPopover(null)
            setEmbedCopied(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="size-5" />
              Embed Code
            </DialogTitle>
          </DialogHeader>
          {embedPopover && (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">
                    {embedPopover.game.title ||
                      `Game #${embedPopover.game.id}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {embedPopover.game.id}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <Label>Paste this into your HTML</Label>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      handleCopyEmbedSnippet(embedPopover.game.id)
                    }
                  >
                    {embedCopied ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {embedCopied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="bg-slate-900 text-slate-300 rounded-md p-4 text-xs overflow-x-auto leading-relaxed">
                  <code>{getEmbedSnippet(embedPopover.game.id)}</code>
                </pre>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmbedPopover(null)
                    setEmbedCopied(false)
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
