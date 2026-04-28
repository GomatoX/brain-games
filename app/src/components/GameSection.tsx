"use client"

import { Panel, PanelHeader, Badge, Button } from "@/components/ui"
import type { Game, GameType } from "@/lib/game-types"

export function GameSection({
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
}) {
  return (
    <Panel>
      <PanelHeader
        title={title}
        count={games.length}
        action={
          <Button size="sm" icon="add" onClick={onAdd}>
            New
          </Button>
        }
      />

      {games.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#64748b]">
          No {title.toLowerCase()} yet. Click &quot;New&quot; to create one.
        </div>
      ) : (
        <div className="divide-y divide-[#e2e8f0]">
          {games.map((game) => (
            <div
              key={game.id}
              className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] truncate">
                  {game.title || `#${game.id}`}
                </p>
                <p className="text-xs text-[#64748b]">
                  {new Date(game.date_created).toLocaleDateString()}
                  {game.created_by && ` · by ${game.created_by}`}
                  {game.word && ` · "${game.word}"`}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
                {game.status === "scheduled" && game.scheduled_date ? (
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="scheduled"
                      onClick={() => onToggleStatus(type, game.id, game.status)}
                      title="Click to publish now"
                    >
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">
                          schedule_send
                        </span>
                        {new Date(game.scheduled_date).toLocaleDateString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </Badge>
                  </div>
                ) : (
                  <Badge
                    variant={game.status === "published" ? "success" : "draft"}
                    onClick={() => onToggleStatus(type, game.id, game.status)}
                    title={`Click to ${game.status === "published" ? "unpublish" : "publish"}`}
                  >
                    {game.status}
                  </Badge>
                )}
                <div className="flex items-center gap-1">
                <button
                  onClick={() => onShowCode(game)}
                  className="p-1.5 text-[#64748b] hover:text-rust transition-colors rounded-lg hover:bg-slate-100"
                  title="Embed Code"
                >
                  <span className="material-symbols-outlined text-lg">
                    code
                  </span>
                </button>
                {onExportCsv && game.words && game.words.length > 0 && (
                  <button
                    onClick={() => onExportCsv(game)}
                    className="p-1.5 text-[#64748b] hover:text-emerald-600 transition-colors rounded-lg hover:bg-slate-100"
                    title="Export CSV"
                  >
                    <span className="material-symbols-outlined text-lg">
                      download
                    </span>
                  </button>
                )}
                <a
                  href={`/play?type=${type === "crosswords" ? "crosswords" : type === "wordgames" ? "word" : type === "wordsearches" ? "wordsearch" : "sudoku"}&id=${game.id}&lang=${lang}&org=${orgId}&preview=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#64748b] hover:text-blue-600 transition-colors rounded-lg hover:bg-slate-100"
                  title="Preview"
                >
                  <span className="material-symbols-outlined text-lg">
                    visibility
                  </span>
                </a>
                <button
                  onClick={() => onEdit(game)}
                  className="p-1.5 text-[#64748b] hover:text-amber-600 transition-colors rounded-lg hover:bg-slate-100"
                  title="Edit"
                >
                  <span className="material-symbols-outlined text-lg">
                    edit
                  </span>
                </button>
                <button
                  onClick={() => onDelete(game.id)}
                  className="p-1.5 text-[#64748b] hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
