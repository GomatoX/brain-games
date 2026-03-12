import { Suspense } from "react"
import Link from "next/link"
import { db } from "@/db"
import {
  crosswords,
  wordgames,
  sudoku,
  organizations,
} from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { platformConfig, isWhiteLabel } from "@/lib/platform"
import { getTranslations } from "@/lib/translations"
import PlayEmbed from "@/components/PlayEmbed"

export const dynamic = "force-dynamic"

const typeIcons: Record<string, string> = {
  crossword: "grid_on",
  word: "spellcheck",
  sudoku: "grid_4x4",
}

const typeLabels: Record<string, Record<string, string>> = {
  en: {
    crossword: "Crossword",
    word: "Word Game",
    sudoku: "Sudoku",
  },
  lt: {
    crossword: "Kryžiažodis",
    word: "Žodžių žaidimas",
    sudoku: "Sudoku",
  },
}

interface PlayPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const params = await searchParams
  const gameId = params.id
  const gameType = params.type

  // If a specific game was requested, render the embed
  if (gameId && gameType) {
    // For preview of unpublished games, inject the org API token
    const isPreview = params.preview === "true"
    let previewToken = params.token || ""

    if (isPreview && !previewToken) {
      // Resolve the org from the game itself or the org param
      const orgParam = params.org
      if (orgParam) {
        const [org] = await db
          .select({ apiToken: organizations.apiToken })
          .from(organizations)
          .where(eq(organizations.id, orgParam))
          .limit(1)
        previewToken = org?.apiToken || ""
      } else {
        // Fallback: find org from the game record
        const table =
          gameType === "crosswords"
            ? crosswords
            : gameType === "word" || gameType === "wordgames"
              ? wordgames
              : sudoku
        const [game] = await db
          .select({ orgId: table.orgId })
          .from(table)
          .where(eq(table.id, gameId))
          .limit(1)
        if (game) {
          const [org] = await db
            .select({ apiToken: organizations.apiToken })
            .from(organizations)
            .where(eq(organizations.id, game.orgId))
            .limit(1)
          previewToken = org?.apiToken || ""
        }
      }
    }

    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
            <div className="flex items-center gap-3 text-[#64748b]">
              <span className="material-symbols-outlined animate-spin">
                progress_activity
              </span>
              Loading…
            </div>
          </div>
        }
      >
        <PlayEmbed previewToken={previewToken} />
      </Suspense>
    )
  }

  // ── Gallery mode: resolve organization ─────────────────
  const orgParam = params.org

  let org: {
    id: string
    name: string
    logoUrl: string | null
    language: string | null
  } | null = null

  if (orgParam) {
    // Explicit org param — scoped to that org
    const [row] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        logoUrl: organizations.logoUrl,
        language: organizations.defaultLanguage,
      })
      .from(organizations)
      .where(eq(organizations.id, orgParam))
      .limit(1)
    org = row || null
  } else {
    // No org param — check if single-org deployment
    const allOrgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        logoUrl: organizations.logoUrl,
        language: organizations.defaultLanguage,
      })
      .from(organizations)
      .limit(2)

    if (allOrgs.length === 1) {
      // Single org — auto-select
      org = allOrgs[0]
    } else if (allOrgs.length > 1 && isWhiteLabel()) {
      // Whitelabel with multiple orgs — use first (shouldn't happen typically)
      org = allOrgs[0]
    }
    // Multi-org SaaS without org param — falls through to "not found"
  }

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9fafb]">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-[#cbd5e1] mb-4 block">
            business
          </span>
          <p className="text-[#94a3b8]">Organization not found</p>
        </div>
      </div>
    )
  }

  // Fetch published games for this org
  const [cw, wg, sd] = await Promise.all([
    db
      .select({
        id: crosswords.id,
        title: crosswords.title,
        createdAt: crosswords.createdAt,
      })
      .from(crosswords)
      .where(
        and(
          eq(crosswords.orgId, org.id),
          eq(crosswords.status, "published"),
        ),
      )
      .orderBy(desc(crosswords.createdAt))
      .limit(50),
    db
      .select({
        id: wordgames.id,
        title: wordgames.title,
        createdAt: wordgames.createdAt,
      })
      .from(wordgames)
      .where(
        and(
          eq(wordgames.orgId, org.id),
          eq(wordgames.status, "published"),
        ),
      )
      .orderBy(desc(wordgames.createdAt))
      .limit(50),
    db
      .select({
        id: sudoku.id,
        title: sudoku.title,
        createdAt: sudoku.createdAt,
      })
      .from(sudoku)
      .where(
        and(
          eq(sudoku.orgId, org.id),
          eq(sudoku.status, "published"),
        ),
      )
      .orderBy(desc(sudoku.createdAt))
      .limit(50),
  ])

  const games = [
    ...cw.map((g) => ({ ...g, type: "crossword" as const })),
    ...wg.map((g) => ({ ...g, type: "word" as const })),
    ...sd.map((g) => ({ ...g, type: "sudoku" as const })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  // Determine which game types have published content
  const availableTypes = [
    ...(cw.length > 0
      ? [{ type: "crossword" as const, apiType: "crosswords" as const }]
      : []),
    ...(wg.length > 0
      ? [{ type: "word" as const, apiType: "wordgames" as const }]
      : []),
    ...(sd.length > 0
      ? [{ type: "sudoku" as const, apiType: "sudoku" as const }]
      : []),
  ]

  const name = platformConfig.name
  const logoUrl = org.logoUrl || null
  const orgId = org.id
  const lang = org.language || "lt"
  const t = getTranslations(lang)
  const labels = typeLabels[lang] || typeLabels.lt

  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb] font-[family-name:var(--font-inter)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
          <Link
            href={`/play${orgParam ? `?org=${orgParam}` : ""}`}
            className="flex items-center gap-2"
          >
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
            {t.play.publishedGames}
          </h1>
          <p className="text-[#64748b] text-base">{t.play.selectGame}</p>
        </div>

        {games.length > 0 ? (
          <>
            {/* ── Latest Games ─────────────────────────────── */}
            {orgId && availableTypes.length > 0 && (
              <section className="mb-14" aria-labelledby="latest-heading">
                <div className="flex items-center gap-2 mb-6">
                  <span className="material-symbols-outlined text-rust text-xl">
                    new_releases
                  </span>
                  <h2
                    id="latest-heading"
                    className="text-lg font-serif font-semibold text-[#0f172a]"
                  >
                    {t.play.latestGames}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {availableTypes.map(({ type, apiType }) => (
                    <Link
                      key={`latest-${type}`}
                      href={`/play?type=${apiType}&id=latest&user=${orgId}`}
                      className="group relative overflow-hidden bg-white border-2 border-[#e2e8f0] rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-rust/50 transition-all"
                    >
                      <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-rust/10 text-rust text-[10px] font-bold uppercase tracking-widest">
                        {t.play.latest}
                      </div>
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                          type === "crossword"
                            ? "bg-blue-50 text-blue-500"
                            : type === "word"
                              ? "bg-green-50 text-green-500"
                              : "bg-purple-50 text-purple-500"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {typeIcons[type] || "sports_esports"}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-semibold mb-1">
                        {labels[type] || "Game"}
                      </p>
                      <h3 className="text-lg font-serif font-bold text-[#0f172a] group-hover:text-rust transition-colors mb-4">
                        {t.play.latestType(labels[type] || "Game")}
                      </h3>
                      <div className="flex items-center gap-2 text-sm font-semibold text-rust pt-4 border-t border-[#e2e8f0] group-hover:text-rust-dark transition-colors">
                        <span className="material-symbols-outlined text-base">
                          play_circle
                        </span>
                        {t.play.playNow}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── All Games ────────────────────────────────── */}
            <section aria-labelledby="all-heading">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#64748b] text-xl">
                  grid_view
                </span>
                <h2
                  id="all-heading"
                  className="text-lg font-serif font-semibold text-[#0f172a]"
                >
                  {t.play.allGames}
                </h2>
              </div>

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
                      {labels[game.type] || "Game"}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-rust pt-4 border-t border-[#e2e8f0] group-hover:text-rust-dark transition-colors">
                      <span className="material-symbols-outlined text-base">
                        play_circle
                      </span>
                      {t.play.play}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-[#cbd5e1] mb-4 block">
              sports_esports
            </span>
            <p className="text-[#94a3b8]">{t.play.noPublishedGames}</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0] bg-[#f1f5f9] py-6 text-center">
        <span className="text-sm text-[#94a3b8]">{name}</span>
      </footer>
    </div>
  )
}
