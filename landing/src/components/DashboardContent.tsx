"use client";

import { useState } from "react";

interface Game {
  id: string | number;
  status: string;
  title: string;
  date_created: string;
  word?: string;
  definition?: string;
  max_attempts?: number;
  difficulty?: string;
  words?: { word: string; clue: string; main_word_index?: number }[];
  main_word?: string;
}

interface Games {
  crosswords: Game[];
  wordgames: Game[];
  sudoku: Game[];
}

type GameType = "crosswords" | "wordgames" | "sudoku";

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  type: GameType;
  game?: Game;
}

const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:5173";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

export default function DashboardContent({
  initialGames,
}: {
  initialGames: Games;
}) {
  const [games, setGames] = useState<Games>(initialGames);
  const [modal, setModal] = useState<ModalState>({
    open: false,
    mode: "create",
    type: "crosswords",
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: GameType;
    id: string | number;
  } | null>(null);
  const [embedPopover, setEmbedPopover] = useState<{
    game: Game;
    type: GameType;
  } | null>(null);
  const [embedCopied, setEmbedCopied] = useState(false);

  function getEmbedSnippet(gameId: string | number, gameType: GameType) {
    const tagMap: Record<GameType, { tag: string; script: string }> = {
      crosswords: {
        tag: "crossword-game",
        script: `${FRONTEND_URL}/dist/crossword-engine.iife.js`,
      },
      wordgames: {
        tag: "word-game",
        script: `${FRONTEND_URL}/dist/word-game.iife.js`,
      },
      sudoku: {
        tag: "sudoku-game",
        script: `${FRONTEND_URL}/dist/sudoku-engine.iife.js`,
      },
    };
    const { tag, script } = tagMap[gameType];
    return `<!-- Load the game engine -->
<script src="${script}"><\/script>

<!-- Drop in the Web Component -->
<${tag}
  puzzle-id="${gameId}"
  api-url="${API_URL}"
  token="YOUR_API_TOKEN"
  theme="light"></${tag}>`;
  }

  function copyEmbedSnippet(gameId: string | number, gameType: GameType) {
    navigator.clipboard.writeText(getEmbedSnippet(gameId, gameType));
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  }

  async function fetchGames() {
    try {
      const res = await fetch("/api/games");
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } catch {
      // Silently fail
    }
  }

  async function handleDelete(type: GameType, id: string | number) {
    try {
      const res = await fetch(`/api/games?collection=${type}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchGames();
      }
    } catch {
      // ignore
    }
    setDeleteConfirm(null);
  }

  async function handleToggleStatus(
    type: GameType,
    id: string | number,
    currentStatus: string,
  ) {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await fetch("/api/games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: type, id, status: newStatus }),
      });
      await fetchGames();
    } catch {
      // ignore
    }
  }

  const totalGames =
    (games?.crosswords.length || 0) +
    (games?.wordgames.length || 0) +
    (games?.sudoku.length || 0);

  const publishedCount = games
    ? [...games.crosswords, ...games.wordgames, ...games.sudoku].filter(
        (g) => g.status === "published",
      ).length
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-medium text-[#0f172a] mb-1">
          Dashboard
        </h1>
        <p className="text-[#64748b] text-sm">
          Manage your brain games and track their status.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="stacks"
          color="blue"
          value={String(totalGames)}
          label="Total Games"
        />
        <StatCard
          icon="check_circle"
          color="green"
          value={String(publishedCount)}
          label="Published"
        />
        <StatCard
          icon="edit_note"
          color="orange"
          value={String(totalGames - publishedCount)}
          label="Drafts"
        />
      </div>

      {/* Game Sections */}
      <div className="flex flex-col gap-6">
        <GameSection
          title="Crosswords"
          icon="grid_on"
          iconColor="blue"
          games={games?.crosswords || []}
          type="crosswords"
          onAdd={() =>
            setModal({ open: true, mode: "create", type: "crosswords" })
          }
          onEdit={(g) =>
            setModal({
              open: true,
              mode: "edit",
              type: "crosswords",
              game: g,
            })
          }
          onDelete={(id) => setDeleteConfirm({ type: "crosswords", id })}
          onToggleStatus={handleToggleStatus}
          onShowCode={(g) => setEmbedPopover({ game: g, type: "crosswords" })}
        />
        <GameSection
          title="Word Games"
          icon="spellcheck"
          iconColor="green"
          games={games?.wordgames || []}
          type="wordgames"
          onAdd={() =>
            setModal({ open: true, mode: "create", type: "wordgames" })
          }
          onEdit={(g) =>
            setModal({
              open: true,
              mode: "edit",
              type: "wordgames",
              game: g,
            })
          }
          onDelete={(id) => setDeleteConfirm({ type: "wordgames", id })}
          onToggleStatus={handleToggleStatus}
          onShowCode={(g) => setEmbedPopover({ game: g, type: "wordgames" })}
        />
        <GameSection
          title="Sudoku"
          icon="tag"
          iconColor="purple"
          games={games?.sudoku || []}
          type="sudoku"
          onAdd={() => setModal({ open: true, mode: "create", type: "sudoku" })}
          onEdit={(g) =>
            setModal({
              open: true,
              mode: "edit",
              type: "sudoku",
              game: g,
            })
          }
          onDelete={(id) => setDeleteConfirm({ type: "sudoku", id })}
          onToggleStatus={handleToggleStatus}
          onShowCode={(g) => setEmbedPopover({ game: g, type: "sudoku" })}
        />
      </div>

      {/* Create/Edit Modal */}
      {modal.open && (
        <GameModal
          mode={modal.mode}
          type={modal.type}
          game={modal.game}
          onClose={() =>
            setModal({ open: false, mode: "create", type: "crosswords" })
          }
          onSaved={fetchGames}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
              Delete Game
            </h3>
            <p className="text-sm text-[#64748b] mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDelete(deleteConfirm.type, deleteConfirm.id)
                }
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Popover */}
      {embedPopover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c25e40]">
                  code
                </span>
                <h2 className="text-lg font-semibold text-[#0f172a]">
                  Embed Code
                </h2>
              </div>
              <button
                onClick={() => {
                  setEmbedPopover(null);
                  setEmbedCopied(false);
                }}
                className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <p className="font-medium text-[#0f172a] text-sm">
                    {embedPopover.game.title || `Game #${embedPopover.game.id}`}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    ID: {embedPopover.game.id}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-[#64748b]">
                    Paste this into your HTML
                  </label>
                  <button
                    onClick={() =>
                      copyEmbedSnippet(embedPopover.game.id, embedPopover.type)
                    }
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-[#0f172a] transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {embedCopied ? "check" : "content_copy"}
                    </span>
                    {embedCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-[#1e293b] text-slate-300 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                  <code>
                    {getEmbedSnippet(embedPopover.game.id, embedPopover.type)}
                  </code>
                </pre>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setEmbedPopover(null);
                    setEmbedCopied(false);
                  }}
                  className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({
  icon,
  color,
  value,
  label,
}: {
  icon: string;
  color: string;
  value: string;
  label: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
          <p className="text-xs text-[#64748b]">{label}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Game Section ─── */
function GameSection({
  title,
  icon,
  iconColor,
  games,
  type,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
  onShowCode,
}: {
  title: string;
  icon: string;
  iconColor: string;
  games: Game[];
  type: GameType;
  onAdd: () => void;
  onEdit: (game: Game) => void;
  onDelete: (id: string | number) => void;
  onToggleStatus: (type: GameType, id: string | number, status: string) => void;
  onShowCode: (game: Game) => void;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[iconColor]}`}
        >
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <h2 className="font-semibold text-[#0f172a]">{title}</h2>
        <span className="text-xs text-[#64748b] bg-slate-100 px-2 py-0.5 rounded-full">
          {games.length}
        </span>
        <button
          onClick={onAdd}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New
        </button>
      </div>

      {games.length === 0 ? (
        <div className="p-8 text-center text-sm text-[#64748b]">
          No {title.toLowerCase()} yet. Click &quot;New&quot; to create one.
        </div>
      ) : (
        <div className="divide-y divide-[#e2e8f0]">
          {games.map((game) => (
            <div
              key={game.id}
              className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] truncate">
                  {game.title || `#${game.id}`}
                </p>
                <p className="text-xs text-[#64748b]">
                  {new Date(game.date_created).toLocaleDateString()}
                  {game.word && ` · "${game.word}"`}
                </p>
              </div>
              <button
                onClick={() => onToggleStatus(type, game.id, game.status)}
                className={`text-xs font-medium px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                  game.status === "published"
                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                }`}
                title={`Click to ${game.status === "published" ? "unpublish" : "publish"}`}
              >
                {game.status}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onShowCode(game)}
                  className="p-1.5 text-[#64748b] hover:text-[#c25e40] transition-colors rounded-lg hover:bg-slate-100"
                  title="Embed Code"
                >
                  <span className="material-symbols-outlined text-lg">
                    code
                  </span>
                </button>
                <a
                  href={`${FRONTEND_URL}/?id=${game.id}${type !== "crosswords" ? `&type=${type === "wordgames" ? "word" : "sudoku"}` : ""}`}
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
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Create/Edit Modal ─── */
function GameModal({
  mode,
  type,
  game,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  type: GameType;
  game?: Game;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdGame, setCreatedGame] = useState<{
    id: string | number;
    title: string;
  } | null>(null);
  const [embedCopied, setEmbedCopied] = useState(false);

  // Form fields
  const [title, setTitle] = useState(game?.title || "");
  const [status, setStatus] = useState(game?.status || "draft");
  const [difficulty, setDifficulty] = useState(game?.difficulty || "medium");
  // Word game fields
  const [word, setWord] = useState(game?.word || "");
  const [definition, setDefinition] = useState(game?.definition || "");
  const [maxAttempts, setMaxAttempts] = useState(game?.max_attempts || 6);
  // Crossword words
  const [wordsInput, setWordsInput] = useState("");
  const [clueInput, setClueInput] = useState("");
  const [mainWord, setMainWord] = useState(game?.main_word || "");
  const [wordsList, setWordsList] = useState<
    { word: string; clue: string; main_word_index?: number }[]
  >(game?.words || []);
  // AI generation state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [aiWordCount, setAiWordCount] = useState(
    difficulty === "easy" ? 5 : difficulty === "hard" ? 12 : 8,
  );
  const [aiLanguage, setAiLanguage] = useState<"lt" | "en">("lt");

  async function generateWithAI() {
    if (!mainWord.trim()) return;
    setAiLoading(true);
    setAiError("");
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
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Generation failed");
      }
      const { words } = await res.json();
      // Merge: add AI words that don't already exist
      const existing = new Set(wordsList.map((w) => w.word));
      const newWords = words
        .filter((w: { word: string; clue: string }) => !existing.has(w.word))
        .map((w: { word: string; clue: string }) => ({
          word: w.word,
          clue: w.clue,
          main_word_index: undefined,
        }));
      setWordsList([...wordsList, ...newWords]);
      setAiSettingsOpen(false);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setAiLoading(false);
    }
  }

  function addWord() {
    const w = wordsInput.trim().toUpperCase();
    if (w && !wordsList.some((entry) => entry.word === w)) {
      setWordsList([
        ...wordsList,
        {
          word: w,
          clue: clueInput.trim() || `Clue for ${w}`,
          main_word_index: undefined,
        },
      ]);
      setWordsInput("");
      setClueInput("");
    }
  }

  function removeWord(w: string) {
    setWordsList(wordsList.filter((entry) => entry.word !== w));
  }

  function getEmbedCode(gameId: string | number): string {
    const tagMap: Record<GameType, { tag: string; script: string }> = {
      crosswords: {
        tag: "crossword-game",
        script: `${FRONTEND_URL}/dist/crossword-engine.iife.js`,
      },
      wordgames: {
        tag: "word-game",
        script: `${FRONTEND_URL}/dist/word-game.iife.js`,
      },
      sudoku: {
        tag: "sudoku-game",
        script: `${FRONTEND_URL}/dist/sudoku-engine.iife.js`,
      },
    };
    const { tag, script } = tagMap[type];
    return `<!-- Load the game engine -->
<script src="${script}"><\/script>

<!-- Drop in the Web Component -->
<${tag}
  puzzle-id="${gameId}"
  api-url="${API_URL}"
  theme="light"></${tag}>`;
  }

  function copyEmbed() {
    if (!createdGame) return;
    navigator.clipboard.writeText(getEmbedCode(createdGame.id));
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const baseData: Record<string, unknown> = {
        collection: type,
        title,
        status,
      };

      if (type === "crosswords") {
        if (mode === "create" && wordsList.length < 2) {
          setError("Add at least 2 words for the crossword");
          setSaving(false);
          return;
        }
        baseData.difficulty = difficulty;
        if (mainWord.trim()) {
          baseData.main_word = mainWord.trim().toUpperCase();
        }
        if (wordsList.length > 0) {
          baseData.words = wordsList.map((w) => {
            const entry: Record<string, unknown> = {
              word: w.word,
              clue: w.clue,
            };
            if (w.main_word_index !== undefined) {
              entry.main_word_index = w.main_word_index;
            }
            return entry;
          });
        }
      } else if (type === "wordgames") {
        if (!word) {
          setError("Word is required");
          setSaving(false);
          return;
        }
        baseData.word = word.toUpperCase();
        baseData.definition = definition;
        baseData.max_attempts = maxAttempts;
      } else if (type === "sudoku") {
        baseData.difficulty = difficulty;
      }

      if (mode === "edit" && game) {
        baseData.id = game.id;
        await fetch("/api/games", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(baseData),
        });
        onSaved();
        onClose();
      } else {
        const res = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(baseData),
        });
        const result = await res.json();
        onSaved();
        setCreatedGame({ id: result.data?.id || result.id, title });
      }
    } catch {
      setError("Failed to save game");
    } finally {
      setSaving(false);
    }
  }

  const typeLabels: Record<GameType, string> = {
    crosswords: "Crossword",
    wordgames: "Word Game",
    sudoku: "Sudoku",
  };

  // Success view with embed code
  if (createdGame) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#0f172a]">
              {typeLabels[type]} Created!
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">
                  check_circle
                </span>
              </div>
              <div>
                <p className="font-medium text-[#0f172a]">
                  &ldquo;{createdGame.title}&rdquo;
                </p>
                <p className="text-xs text-[#64748b]">ID: {createdGame.id}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#0f172a]">
                  Embed Code
                </label>
                <button
                  onClick={copyEmbed}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-medium text-[#0f172a] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">
                    {embedCopied ? "check" : "content_copy"}
                  </span>
                  {embedCopied ? "Copied!" : "Copy Snippet"}
                </button>
              </div>
              <pre className="bg-[#1e293b] text-slate-300 rounded-lg p-4 text-xs overflow-x-auto leading-relaxed">
                <code>{getEmbedCode(createdGame.id)}</code>
              </pre>
            </div>

            <p className="text-xs text-[#64748b] mb-5">
              Paste this snippet into your website&apos;s HTML to display the
              game. Make sure your API token is active on the{" "}
              <span className="font-medium text-[#c25e40]">
                API Keys &amp; Embeds
              </span>{" "}
              page.
            </p>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#0f172a]">
            {mode === "create" ? "Create" : "Edit"} {typeLabels[type]}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#64748b] hover:text-[#0f172a] transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
              placeholder="Game title"
              required
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Difficulty (crosswords / sudoku) */}
          {(type === "crosswords" || type === "sudoku") && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          )}

          {/* Crossword — Words + Clues */}
          {type === "crosswords" && (
            <>
              {/* Main Word */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Main Word{" "}
                  <span className="text-xs text-[#64748b] font-normal">
                    (hidden word players discover)
                  </span>
                </label>
                <input
                  type="text"
                  value={mainWord}
                  onChange={(e) => setMainWord(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
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
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-[#c25e40] to-[#e07b5b] text-white rounded-lg text-sm font-medium transition-all hover:shadow-md hover:shadow-[#c25e40]/20 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {aiLoading ? (
                        <>
                          <span className="material-symbols-outlined text-base animate-spin">
                            progress_activity
                          </span>
                          Generating…
                        </>
                      ) : (
                        <>
                          <span className="text-base">✨</span>
                          Generate with AI
                          <span className="material-symbols-outlined text-sm">
                            {aiSettingsOpen ? "expand_less" : "expand_more"}
                          </span>
                        </>
                      )}
                    </button>

                    {aiSettingsOpen && !aiLoading && (
                      <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-[#e2e8f0] space-y-3">
                        {/* Word Count */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-[#0f172a]">
                              Number of words
                            </label>
                            <span className="text-xs font-mono font-bold text-[#c25e40]">
                              {aiWordCount}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={3}
                            max={20}
                            value={aiWordCount}
                            onChange={(e) =>
                              setAiWordCount(Number(e.target.value))
                            }
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c25e40]"
                          />
                          <div className="flex justify-between text-[10px] text-[#94a3b8] mt-0.5">
                            <span>3</span>
                            <span>20</span>
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <label className="text-xs font-medium text-[#0f172a] block mb-1">
                            Language
                          </label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setAiLanguage("lt")}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                aiLanguage === "lt"
                                  ? "bg-[#c25e40] text-white border-[#c25e40]"
                                  : "bg-white text-[#0f172a] border-[#e2e8f0] hover:border-[#c25e40]"
                              }`}
                            >
                              🇱🇹 Lithuanian
                            </button>
                            <button
                              type="button"
                              onClick={() => setAiLanguage("en")}
                              className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                aiLanguage === "en"
                                  ? "bg-[#c25e40] text-white border-[#c25e40]"
                                  : "bg-white text-[#0f172a] border-[#e2e8f0] hover:border-[#c25e40]"
                              }`}
                            >
                              🇬🇧 English
                            </button>
                          </div>
                        </div>

                        {/* Generate Action */}
                        <button
                          type="button"
                          onClick={generateWithAI}
                          className="w-full px-4 py-2 bg-[#0f172a] text-white rounded-lg text-sm font-medium hover:bg-[#1e293b] transition-colors"
                        >
                          Generate {aiWordCount} words
                        </button>
                      </div>
                    )}

                    {aiError && (
                      <p className="text-xs text-red-600 mt-1.5">{aiError}</p>
                    )}
                  </>
                )}
              </div>

              {/* Words & Clues */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Words &amp; Clues
                </label>
                <div className="flex flex-col gap-2 mb-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={wordsInput}
                      onChange={(e) => setWordsInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addWord();
                        }
                      }}
                      className="w-36 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
                      placeholder="Word"
                    />
                    <input
                      type="text"
                      value={clueInput}
                      onChange={(e) => setClueInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addWord();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
                      placeholder="Clue (optional)"
                    />
                    <button
                      type="button"
                      onClick={addWord}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {wordsList.length > 0 && (
                  <div className="border border-[#e2e8f0] rounded-lg divide-y divide-[#e2e8f0] mb-2">
                    {wordsList.map((entry, idx) => (
                      <div key={entry.word} className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono font-bold text-[#0f172a] w-20 shrink-0">
                            {entry.word}
                          </span>
                          <span className="text-xs text-[#64748b] flex-1 truncate">
                            {entry.clue}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeWord(entry.word)}
                            className="text-[#94a3b8] hover:text-red-500 transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        </div>
                        {/* Letter picker for main word */}
                        {mainWord && (
                          <div className="flex gap-1 mt-1.5">
                            {entry.word.split("").map((letter, letterIdx) => {
                              const isSelected =
                                entry.main_word_index === letterIdx;
                              return (
                                <button
                                  key={letterIdx}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...wordsList];
                                    updated[idx] = {
                                      ...updated[idx],
                                      main_word_index: isSelected
                                        ? undefined
                                        : letterIdx,
                                    };
                                    setWordsList(updated);
                                  }}
                                  className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded border transition-all ${
                                    isSelected
                                      ? "bg-[#c25e40] text-white border-[#c25e40] ring-2 ring-[#c25e40]/30"
                                      : "bg-white text-[#0f172a] border-[#e2e8f0] hover:border-[#c25e40] hover:bg-[#fcece8]"
                                  }`}
                                  title={`Select letter "${letter}" for main word`}
                                >
                                  {letter}
                                </button>
                              );
                            })}
                            <span className="text-[10px] text-[#94a3b8] ml-1 self-center">
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
                <p className="text-xs text-[#64748b]">
                  {wordsList.length} word{wordsList.length !== 1 ? "s" : ""}{" "}
                  added
                  {mode === "create" && wordsList.length < 2 && (
                    <span className="text-amber-600 ml-1">
                      (min 2 required)
                    </span>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Word Game fields */}
          {type === "wordgames" && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Word
                </label>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
                  placeholder="e.g. HELLO"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Definition / Hint
                </label>
                <textarea
                  value={definition}
                  onChange={(e) => setDefinition(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40] resize-none"
                  rows={2}
                  placeholder="Optional hint for the player"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">
                  Max Attempts
                </label>
                <input
                  type="number"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  min={1}
                  max={10}
                  className="w-24 px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c25e40]/20 focus:border-[#c25e40]"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#c25e40] text-white rounded-lg hover:bg-[#a0492d] disabled:opacity-50 transition-colors font-medium"
            >
              {saving
                ? "Saving…"
                : mode === "create"
                  ? "Create"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
