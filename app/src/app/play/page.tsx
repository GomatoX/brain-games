import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/db";
import { crosswords, wordgames, sudoku, organizations } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { platformConfig } from "@/lib/platform";
import PlayEmbed from "@/components/PlayEmbed";

export const dynamic = "force-dynamic";

const typeIcons: Record<string, string> = {
  crossword: "grid_on",
  word: "spellcheck",
  sudoku: "grid_4x4",
};

const typeLabels: Record<string, string> = {
  crossword: "Crossword",
  word: "Word Game",
  sudoku: "Sudoku",
};

interface PlayPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const params = await searchParams;
  const gameId = params.id;
  const gameType = params.type;

  // If a specific game was requested, render the embed
  if (gameId && gameType) {
    // For preview of unpublished games, inject the org API token
    const isPreview = params.preview === "true";
    let previewToken = params.token || "";

    if (isPreview && !previewToken) {
      const [org] = await db
        .select({ apiToken: organizations.apiToken })
        .from(organizations)
        .limit(1);
      previewToken = org?.apiToken || "";
    }

    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
            <div className="flex items-center gap-3 text-[#64748b]">
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
              Loading game…
            </div>
          </div>
        }
      >
        <PlayEmbed previewToken={previewToken} />
      </Suspense>
    );
  }

  // Otherwise, show the games gallery
  const [cw, wg, sd] = await Promise.all([
    db
      .select({
        id: crosswords.id,
        title: crosswords.title,
        createdAt: crosswords.createdAt,
      })
      .from(crosswords)
      .where(eq(crosswords.status, "published"))
      .orderBy(desc(crosswords.createdAt))
      .limit(50),
    db
      .select({
        id: wordgames.id,
        title: wordgames.title,
        createdAt: wordgames.createdAt,
      })
      .from(wordgames)
      .where(eq(wordgames.status, "published"))
      .orderBy(desc(wordgames.createdAt))
      .limit(50),
    db
      .select({
        id: sudoku.id,
        title: sudoku.title,
        createdAt: sudoku.createdAt,
      })
      .from(sudoku)
      .where(eq(sudoku.status, "published"))
      .orderBy(desc(sudoku.createdAt))
      .limit(50),
  ]);

  const games = [
    ...cw.map((g) => ({ ...g, type: "crossword" as const })),
    ...wg.map((g) => ({ ...g, type: "word" as const })),
    ...sd.map((g) => ({ ...g, type: "sudoku" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Fetch org logo for branding
  const [org] = await db
    .select({ logoUrl: organizations.logoUrl })
    .from(organizations)
    .limit(1);

  const name = platformConfig.name;
  const logoUrl = org?.logoUrl || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] font-[family-name:var(--font-inter)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
          <Link href="/play" className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="h-6 max-w-[120px] object-contain"
              />
            ) : (
              <>
                <span className="material-symbols-outlined text-rust text-xl">
                  settings_suggest
                </span>
                <span className="text-base font-bold font-serif text-[#0f172a]">
                  {name}
                </span>
              </>
            )}
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-medium text-[#0f172a] mb-3">
            Published Games
          </h1>
          <p className="text-[#64748b] text-base">Select a game to play</p>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {games.map((game) => (
              <Link
                key={`${game.type}-${game.id}`}
                href={`/play?type=${game.type === "crossword" ? "crosswords" : game.type}&id=${game.id}`}
                className="group bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-rust/40 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-serif font-bold text-[#0f172a] group-hover:text-rust transition-colors">
                    {game.title}
                  </h3>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      game.type === "crossword"
                        ? "bg-blue-50 text-blue-500"
                        : game.type === "word"
                          ? "bg-green-50 text-green-500"
                          : "bg-purple-50 text-purple-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {typeIcons[game.type] || "sports_esports"}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#94a3b8] uppercase tracking-wide font-medium mb-4">
                  {typeLabels[game.type] || "Game"}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-rust pt-4 border-t border-[#e2e8f0] group-hover:text-rust-dark transition-colors">
                  <span className="material-symbols-outlined text-base">
                    play_circle
                  </span>
                  Play
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#cbd5e1] mb-4 block">
              sports_esports
            </span>
            <p className="text-[#94a3b8]">No published games yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] bg-[#f1f5f9] py-6 text-center">
        <span className="text-sm text-[#94a3b8]">{name}</span>
      </footer>
    </div>
  );
}
