"use client"

import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Code,
  Download,
  Eye,
  Pencil,
  Trash2,
  CalendarClock,
} from "lucide-react"
import type { Game, GameType } from "@/lib/game-types"

export const GameSection = ({
  title,
  games,
  type,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  onShowCode,
  onExportCsv,
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
  onExportCsv?: (game: Game) => void
  lang: string
  orgId: string
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[15px] flex items-center gap-2">
          {title}
          <Badge variant="secondary">{games.length}</Badge>
        </CardTitle>
        <CardAction>
          <Button size="sm" onClick={onAdd}>
            <Plus className="size-4" />
            New
          </Button>
        </CardAction>
      </CardHeader>

      {games.length === 0 ? (
        <div className="p-8 text-center text-sm text-muted-foreground">
          No {title.toLowerCase()} yet. Click &quot;New&quot; to create one.
        </div>
      ) : (
        <div className="divide-y divide-border border-t">
          {games.map((game) => (
            <div
              key={game.id}
              className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] truncate">
                  {game.title || `#${game.id}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(game.date_created).toLocaleDateString()}
                  {game.created_by && ` · by ${game.created_by}`}
                  {game.word && ` · "${game.word}"`}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                {game.status === "scheduled" && game.scheduled_date ? (
                  <Badge
                    variant="scheduled"
                    onClick={() => onToggleStatus(type, game.id, game.status)}
                    title="Click to publish now"
                    className="cursor-pointer"
                  >
                    <CalendarClock className="size-3" />
                    {new Date(game.scheduled_date).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </Badge>
                ) : (
                  <Badge
                    variant={game.status === "published" ? "success" : "draft"}
                    onClick={() => onToggleStatus(type, game.id, game.status)}
                    title={`Click to ${game.status === "published" ? "unpublish" : "publish"}`}
                    className="cursor-pointer"
                  >
                    {game.status}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onShowCode(game)}
                    title="Embed Code"
                    className="hover:text-rust"
                  >
                    <Code className="size-4" />
                  </Button>
                  {onExportCsv && game.words && game.words.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onExportCsv(game)}
                      title="Export CSV"
                      className="hover:text-emerald-600"
                    >
                      <Download className="size-4" />
                    </Button>
                  )}
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    title="Preview"
                    className="hover:text-blue-600"
                  >
                    <a
                      href={`/play?type=${type === "crosswords" ? "crosswords" : type === "wordgames" ? "word" : type === "wordsearches" ? "wordsearch" : "sudoku"}&id=${game.id}&lang=${lang}&org=${orgId}&preview=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="size-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(game)}
                    title="Edit"
                    className="hover:text-amber-600"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(game.id)}
                    title="Delete"
                    className="hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
