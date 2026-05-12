"use client"

import { Button } from "@/components/ui/button"


import { StatusPill } from "@/components/ui/StatusPill"
import { DifficultyDots } from "@/components/ui/DifficultyDots"
import { MiniCrossword } from "@/components/ui/MiniCrossword"
import { TitleCell } from "@/components/ui/TitleCell"
import {
  Plus,
  Eye,
  Pencil,
  Code,
  CalendarClock,
  Inbox,
  Grid3x3,
  SpellCheck2,
  Search,
} from "lucide-react"
import type { Game, GameType } from "@/lib/game-types"

const GAME_ICON: Record<GameType, typeof Grid3x3> = {
  crosswords: Grid3x3,
  wordgames: SpellCheck2,
  wordsearches: Search,
  sudoku: Grid3x3,
}

const formatRelativeTime = (dateStr: string) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1d ago"
  if (diffDays < 30) return `${diffDays}d ago`
  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths}mo ago`
}

const getSubtitle = (game: Game, type: GameType) => {
  if (type === "crosswords") {
    const gridSize = game.grid_size || 13
    return `${gridSize}×${gridSize} grid`
  }
  if (type === "wordgames" && game.word) return `"${game.word}"`
  return game.created_by || ""
}

export const GameSection = ({
  title,
  games,
  type,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  onShowCode,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  lang,
  orgId,
}: {
  title: string
  games: Game[]
  type: GameType
  onAdd: () => void
  onEdit: (game: Game) => void
  onDelete: (id: string | number) => void
  onToggleStatus: (type: GameType, id: string | number, status: string) => void
  onShowCode: (game: Game) => void
  selected: Set<string | number>
  onToggleSelect: (id: string | number) => void
  onToggleSelectAll: () => void
  lang: string
  orgId: string
}) => {
  if (games.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="py-14 flex flex-col items-center gap-3 text-center">
          <Inbox className="size-10 text-muted-foreground/40" strokeWidth={1.2} />
          <p className="text-sm text-muted-foreground">
            No {title.toLowerCase()} yet.
          </p>
          <Button type="button" size="sm" onClick={onAdd}>
            <Plus className="size-4" />
            Create first
          </Button>
        </div>
      </div>
    )
  }

  const hasEntries = type === "crosswords" || type === "wordsearches"
  const hasDifficulty = type !== "wordgames"
  const hasWordColumn = type === "wordgames"

  const firstColumnHeader =
    type === "wordsearches"
      ? "Pack"
      : type === "wordgames"
        ? "Game"
        : "Puzzle"

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="gtbl">
        <thead>
          <tr>
            <th style={{ width: "3%" }}>
              <input
                type="checkbox"
                checked={games.length > 0 && selected.size === games.length}
                onChange={onToggleSelectAll}
                aria-label="Select all games"
                className="accent-primary size-3.5 cursor-pointer"
              />
            </th>
            <th style={{ width: "27%" }}>{firstColumnHeader}</th>
            {hasWordColumn && <th style={{ width: "14%" }}>Word</th>}
            {hasEntries && <th style={{ width: "13%" }}>Entries</th>}
            {hasDifficulty && <th style={{ width: "14%" }}>Difficulty</th>}
            <th style={{ width: "13%" }}>Status</th>
            <th style={{ width: "10%" }}>Plays</th>
            <th style={{ width: "10%" }}>Updated</th>
            <th style={{ width: "8%", textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => {
            const Icon = GAME_ICON[type]
            return (
              <tr key={game.id}>
                {/* Checkbox */}
                <td>
                  <input
                    type="checkbox"
                    checked={selected.has(game.id)}
                    onChange={() => onToggleSelect(game.id)}
                    aria-label={`Select ${game.title || game.id}`}
                    className="accent-primary size-3.5 cursor-pointer"
                  />
                </td>
                {/* Puzzle */}
                <td>
                  <TitleCell
                    icon={<Icon className="size-[14px]" />}
                    title={game.title || `#${game.id}`}
                    subtitle={getSubtitle(game, type)}
                  />
                </td>

                {/* Word (word game tiles) */}
                {hasWordColumn && (
                  <td>
                    <div className="flex gap-[3px]">
                      {(game.word || "").toUpperCase().split("").slice(0, 5).map((letter, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center rounded-[3px] border text-[11px] font-bold"
                          style={{
                            width: 22,
                            height: 26,
                            background:
                              game.status === "published"
                                ? i % 3 === 0
                                  ? "var(--tool-accent)"
                                  : i % 3 === 1
                                    ? "#fdf2ea"
                                    : "var(--tool-surface)"
                                : "var(--tool-surface)",
                            color:
                              game.status === "published" && i % 3 === 0
                                ? "white"
                                : game.status === "published" && i % 3 === 1
                                  ? "var(--tool-accent)"
                                  : "var(--tool-text)",
                            borderColor:
                              game.status === "published" && i % 3 !== 2
                                ? "transparent"
                                : "var(--tool-border)",
                          }}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                  </td>
                )}

                {/* Entries */}
                {hasEntries && (
                  <td>
                    <div className="flex items-center gap-2">
                      {type === "crosswords" && <MiniCrossword />}
                      <span className="font-mono text-xs text-muted-foreground">
                        {game.words?.length ?? 0}
                      </span>
                    </div>
                  </td>
                )}

                {/* Difficulty */}
                {hasDifficulty && (
                  <td>
                    <DifficultyDots difficulty={game.difficulty || "easy"} />
                  </td>
                )}

                {/* Status */}
                <td>
                  {game.status === "scheduled" && game.scheduled_date ? (
                    <div className="flex flex-col gap-0.5">
                      <StatusPill
                        status="scheduled"
                        onClick={() =>
                          onToggleStatus(type, game.id, game.status)
                        }
                        title="Click to publish now"
                      />
                      <span className="text-[10px] text-muted-foreground font-mono">
                        <CalendarClock className="inline size-3 mr-0.5" />
                        {new Date(game.scheduled_date).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric" },
                        )}
                      </span>
                    </div>
                  ) : (
                    <StatusPill
                      status={game.status}
                      onClick={() =>
                        onToggleStatus(type, game.id, game.status)
                      }
                      title={`Click to ${game.status === "published" ? "unpublish" : "publish"}`}
                    />
                  )}
                </td>

                {/* Plays */}
                <td>
                  <span className="font-mono text-xs text-muted-foreground">
                    {game.status === "published"
                      ? (game.plays ?? 0).toLocaleString()
                      : "—"}
                  </span>
                </td>

                {/* Updated */}
                <td>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatRelativeTime(
                      game.date_updated || game.date_created,
                    )}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="row-actions justify-end">
                    <Button
                      asChild
                      variant="outline"
                      size="icon"
                      className="size-8"
                    >
                      <a
                        href={`/play?type=${type === "crosswords" ? "crosswords" : type === "wordgames" ? "word" : type === "wordsearches" ? "wordsearch" : "sudoku"}&id=${game.id}&lang=${lang}&org=${orgId}&preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview"
                        aria-label="Preview"
                        tabIndex={0}
                      >
                        <Eye className="size-4" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => onEdit(game)}
                      title="Edit"
                      aria-label="Edit"
                      tabIndex={0}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => onShowCode(game)}
                      title="Embed code"
                      aria-label="Embed code"
                      tabIndex={0}
                    >
                      <Code className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
