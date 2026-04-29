import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { wordgames, users, organizations } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"
import DashboardContainer from "@/components/DashboardContainer"
import { GameListClient } from "@/components/GameListClient"
import { mapGame } from "@/lib/game-types"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

const PAGE_SIZE = 20

export default async function WordGamePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const user = await getAuthenticatedUser()
  await promoteScheduledGames()

  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const [rows, countResult, orgRow] = await Promise.all([
    db
      .select({
        id: wordgames.id,
        status: wordgames.status,
        title: wordgames.title,
        word: wordgames.word,
        definition: wordgames.definition,
        maxAttempts: wordgames.maxAttempts,
        scheduledDate: wordgames.scheduledDate,
        brandingId: wordgames.brandingId,
        userId: wordgames.userId,
        orgId: wordgames.orgId,
        createdAt: wordgames.createdAt,
        updatedAt: wordgames.updatedAt,
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
        creatorEmail: users.email,
      })
      .from(wordgames)
      .innerJoin(users, eq(users.id, wordgames.userId))
      .where(eq(wordgames.orgId, user.orgId))
      .orderBy(desc(wordgames.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ value: count() })
      .from(wordgames)
      .where(eq(wordgames.orgId, user.orgId)),
    db
      .select({ language: organizations.defaultLanguage })
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1)
      .then((r) => r[0]),
  ])

  const total = Number(countResult[0]?.value ?? 0)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <DashboardContainer>
      <GameListClient
        games={rows.map(mapGame)}
        type="wordgames"
        page={page}
        totalPages={totalPages}
        total={total}
        orgId={user.orgId}
        initialLang={orgRow?.language || "lt"}
        title="Word Games"
        basePath="/dashboard/word-game"
      />
    </DashboardContainer>
  )
}
