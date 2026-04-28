"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui"
import { GameSection } from "@/components/GameSection"
import { GameModal } from "@/components/GameModal"
import { GamePagination } from "@/components/GamePagination"
import type { Game, GameType } from "@/lib/game-types"

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
  icon: string
  iconColor: string
  basePath: string
}

export function GameListClient({
  games,
  type,
  page,
  totalPages,
  total,
  orgId,
  initialLang,
  title,
  icon,
  iconColor,
  basePath,
}: Props) {
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
  const [embedPopover, setEmbedPopover] = useState<{
    game: Game
    type: GameType
  } | null>(null)
  const [embedCopied, setEmbedCopied] = useState(false)

  function getEmbedSnippet(gameId: string | number) {
    const tagMap: Record<GameType, { tag: string; script: string }> = {
      crosswords: { tag: "crossword-game", script: `${PLAY_BASE}/dist/crossword-engine.iife.js` },
      wordgames: { tag: "word-game", script: `${PLAY_BASE}/dist/word-game.iife.js` },
      sudoku: { tag: "sudoku-game", script: `${PLAY_BASE}/dist/sudoku-engine.iife.js` },
      wordsearches: { tag: "word-search-game", script: `${PLAY_BASE}/dist/word-search-engine.iife.js` },
    }
    const { tag, script } = tagMap[type]
    return `<script src="${script}"><\/script>\n\n<${tag}\n  puzzle-id="${gameId}"\n  api-url="${API_URL}"\n  user-id="${orgId}"\n  lang="${initialLang}"\n  theme="light"></${tag}>`
  }

  function copyEmbedSnippet(gameId: string | number) {
    navigator.clipboard.writeText(getEmbedSnippet(gameId))
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  const exportGameCsv = (game: Game) => {
    const rows: string[][] = []
    if (game.main_word) { rows.push(["Main Word", game.main_word]); rows.push([]) }
    rows.push(["Word", "Clue"])
    if (game.words) {
      for (const w of game.words) rows.push([w.word, w.clue])
    }
    const csvContent = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${game.title || "crossword"}-words.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete(deleteType: GameType, id: string | number) {
    try {
      const res = await fetch(`/api/games?collection=${deleteType}&id=${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch {
      // ignore
    }
    setDeleteConfirm(null)
  }

  async function handleToggleStatus(
    toggleType: GameType,
    id: string | number,
    currentStatus: string,
  ) {
    const newStatus = currentStatus === "published" ? "draft" : "published"
    try {
      await fetch("/api/games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: toggleType,
          id,
          status: newStatus,
          scheduled_date: newStatus === "published" ? null : undefined,
        }),
      })
      router.refresh()
    } catch {
      // ignore
    }
  }

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  }

  return (
    <div>
      <div className="px-4 sm:px-6 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[iconColor] ?? "bg-slate-100 text-slate-600"}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#0f172a] leading-tight">{title}</h1>
          <p className="text-sm text-[#64748b]">{total} total · page {page} of {Math.max(1, totalPages)}</p>
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
        onExportCsv={type === "crosswords" ? exportGameCsv : undefined}
        lang={initialLang}
        orgId={orgId}
      />

      <GamePagination page={page} totalPages={totalPages} basePath={basePath} />

      {modal.open && (
        <GameModal
          mode={modal.mode}
          type={type}
          game={modal.game}
          orgId={orgId}
          onClose={() => setModal({ open: false, mode: "create" })}
          onSaved={() => { setModal({ open: false, mode: "create" }); router.refresh() }}
        />
      )}

      {/* Delete Confirmation */}
      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Game"
        size="sm"
      >
        <div className="p-4 sm:p-6">
          <p className="text-sm text-[#64748b] mb-6">
            Are you sure? This action cannot be undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm.type, deleteConfirm.id)}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Embed Code Popover */}
      <Modal
        open={!!embedPopover}
        onClose={() => { setEmbedPopover(null); setEmbedCopied(false) }}
        title="Embed Code"
        icon="code"
        size="md"
      >
        {embedPopover && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="min-w-0">
                <p className="font-medium text-[#0f172a] text-sm truncate">
                  {embedPopover.game.title || `Game #${embedPopover.game.id}`}
                </p>
                <p className="text-xs text-[#64748b]">ID: {embedPopover.game.id}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2 gap-2">
                <label className="text-sm font-medium text-[#64748b]">
                  Paste this into your HTML
                </label>
                <button
                  onClick={() => copyEmbedSnippet(embedPopover.game.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-[#0f172a] transition-colors flex items-center gap-1.5 flex-shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">
                    {embedCopied ? "check" : "content_copy"}
                  </span>
                  {embedCopied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="bg-[#1e293b] text-slate-300 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                <code>{getEmbedSnippet(embedPopover.game.id)}</code>
              </pre>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => { setEmbedPopover(null); setEmbedCopied(false) }}
                className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
