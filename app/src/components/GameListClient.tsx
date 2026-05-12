"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"

import { PageHeader } from "@/components/ui/PageHeader"
import { SearchInput } from "@/components/ui/SearchInput"
import { FilterChip } from "@/components/ui/FilterChip"

import { Code, Copy, Check, Plus, Upload } from "lucide-react"
import { toast } from "sonner"
import { GameSection } from "@/components/GameSection"
import { GameModal } from "@/components/GameModal"
import { GamePagination } from "@/components/GamePagination"
import type { Game, GameType } from "@/lib/game-types"

const PLAY_BASE =
  typeof window !== "undefined" ? `${window.location.origin}/play` : "/play"
const API_URL = typeof window !== "undefined" ? window.location.origin : ""

const FILTERS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "scheduled", label: "Scheduled" },
  { id: "draft", label: "Draft" },
] as const

type Props = {
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
  const [selected, setSelected] = useState<Set<string | number>>(new Set())

  /* ── Client-side search + filter ── */
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<string>("all")

  const counts = useMemo(
    () => ({
      all: games.length,
      published: games.filter((g) => g.status === "published").length,
      scheduled: games.filter((g) => g.status === "scheduled").length,
      draft: games.filter((g) => g.status === "draft").length,
    }),
    [games],
  )

  const filteredGames = useMemo(() => {
    let result = games
    if (filter !== "all") {
      result = result.filter((g) => g.status === filter)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (g) =>
          (g.title || "").toLowerCase().includes(q) ||
          (g.word || "").toLowerCase().includes(q),
      )
    }
    return result
  }, [games, filter, query])

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

  const handleToggleSelect = (id: string | number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleSelectAll = () => {
    if (selected.size === filteredGames.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filteredGames.map((g) => g.id)))
    }
  }

  const handleExportCsv = () => {
    const gamesToExport = selected.size > 0
      ? filteredGames.filter((g) => selected.has(g.id))
      : filteredGames
    if (gamesToExport.length === 0) {
      toast.error("No games to export")
      return
    }

    const rows: string[][] = []

    if (type === "crosswords") {
      rows.push(["Game Title", "Main Word", "Grid Size", "Difficulty", "Status", "Word", "Clue"])
      for (const game of gamesToExport) {
        const words = game.words ?? []
        if (words.length === 0) {
          rows.push([
            game.title || "",
            game.main_word || "",
            String(game.grid_size || 13),
            game.difficulty || "",
            game.status || "",
            "",
            "",
          ])
        } else {
          for (const w of words) {
            rows.push([
              game.title || "",
              game.main_word || "",
              String(game.grid_size || 13),
              game.difficulty || "",
              game.status || "",
              w.word,
              w.clue,
            ])
          }
        }
      }
    } else if (type === "wordgames") {
      rows.push(["Game Title", "Word", "Definition", "Max Attempts", "Difficulty", "Status"])
      for (const game of gamesToExport) {
        rows.push([
          game.title || "",
          game.word || "",
          game.definition || "",
          String(game.max_attempts ?? ""),
          game.difficulty || "",
          game.status || "",
        ])
      }
    } else if (type === "wordsearches") {
      rows.push(["Game Title", "Difficulty", "Status", "Word", "Clue"])
      for (const game of gamesToExport) {
        const words = game.words ?? []
        if (words.length === 0) {
          rows.push([
            game.title || "",
            game.difficulty || "",
            game.status || "",
            "",
            "",
          ])
        } else {
          for (const w of words) {
            rows.push([
              game.title || "",
              game.difficulty || "",
              game.status || "",
              w.word,
              w.clue,
            ])
          }
        }
      }
    } else {
      rows.push(["Game Title", "Difficulty", "Status", "Plays", "Created"])
      for (const game of gamesToExport) {
        rows.push([
          game.title || "",
          game.difficulty || "",
          game.status || "",
          String(game.plays ?? 0),
          game.date_created || "",
        ])
      }
    }

    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title.toLowerCase()}-export.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${gamesToExport.length} ${gamesToExport.length === 1 ? "game" : "games"}`)
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
      {/* ── Page header ── */}
      <PageHeader
        title={title}
        subtitle={`${total} ${total === 1 ? "puzzle" : "puzzles"} · ${counts.published} published, ${counts.draft} drafts`}
        action={
          <Button
            type="button"
            onClick={() => setModal({ open: true, mode: "create" })}
          >
            <Plus className="size-4" />
            New {title.replace(/s$/, "")}
          </Button>
        }
        className="mb-3"
      />

      {/* ── Games sub-nav ── */}
      <nav className="games-nav" aria-label="Game types">
        <Link
          href="/dashboard/word-game"
          className={type === "wordgames" ? "active" : ""}
        >
          Word Game
        </Link>
        <Link
          href="/dashboard/word-search"
          className={type === "wordsearches" ? "active" : ""}
        >
          Word Search
        </Link>
        <Link
          href="/dashboard/crosswords"
          className={type === "crosswords" ? "active" : ""}
        >
          Crossword
        </Link>
      </nav>

      {/* ── Toolbar ── */}
      <div className="list-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={
            type === "wordgames"
              ? "Search by title or word…"
              : "Search…"
          }
        />
        {FILTERS.map((f) => (
          <FilterChip
            key={f.id}
            label={f.label}
            count={counts[f.id as keyof typeof counts]}
            active={filter === f.id}
            onClick={() => setFilter(f.id)}
          />
        ))}
        <div className="flex-1" />
        {selected.size > 0 && (
          <span className="text-xs text-muted-foreground self-center">
            {selected.size} selected
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleExportCsv}
          disabled={selected.size === 0}
          aria-label="Export games as CSV"
          tabIndex={0}
        >
          <Upload className="size-3.5" />
          Export{selected.size > 0 ? ` (${selected.size})` : ""}
        </Button>
      </div>

      {/* ── Table ── */}
      <GameSection
        title={title}
        games={filteredGames}
        type={type}
        onAdd={() => setModal({ open: true, mode: "create" })}
        onEdit={(g) => setModal({ open: true, mode: "edit", game: g })}
        onDelete={(id) => setDeleteConfirm({ type, id })}
        onToggleStatus={handleToggleStatus}
        onShowCode={(g) => setEmbedPopover({ game: g, type })}
        selected={selected}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        lang={initialLang}
        orgId={orgId}
      />

      {/* ── Pagination ── */}
      <GamePagination
        page={page}
        totalPages={totalPages}
        total={total}
        basePath={basePath}
      />

      {/* ── Create/Edit Modal ── */}
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

      {/* ── Delete Confirmation ── */}
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
              type="button"
              variant="ghost"
              onClick={() => setDeleteConfirm(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
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

      {/* ── Embed Code Dialog ── */}
      <Dialog
        open={!!embedPopover}
        onOpenChange={(open) => {
          if (!open) {
            setEmbedPopover(null)
            setEmbedCopied(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
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
                  <FieldLabel className="mb-0">
                    Paste this into your HTML
                  </FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
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
                <pre className="bg-foreground text-muted rounded-md p-4 text-xs overflow-x-auto leading-relaxed font-mono">
                  <code>{getEmbedSnippet(embedPopover.game.id)}</code>
                </pre>
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
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
