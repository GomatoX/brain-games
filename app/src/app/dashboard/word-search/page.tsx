import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { wordsearches, users, organizations } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { Search } from "lucide-react"
import DashboardContainer from "@/components/DashboardContainer"
import { GameListClient } from "@/components/GameListClient"
import { mapGame } from "@/lib/game-types"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

const PAGE_SIZE = 20

export default async function WordSearchPage({
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
        id: wordsearches.id,
        status: wordsearches.status,
        title: wordsearches.title,
        difficulty: wordsearches.difficulty,
        words: wordsearches.words,
        gridSize: wordsearches.gridSize,
        scheduledDate: wordsearches.scheduledDate,
        brandingId: wordsearches.brandingId,
        userId: wordsearches.userId,
        orgId: wordsearches.orgId,
        createdAt: wordsearches.createdAt,
        updatedAt: wordsearches.updatedAt,
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
        creatorEmail: users.email,
      })
      .from(wordsearches)
      .innerJoin(users, eq(users.id, wordsearches.userId))
      .where(eq(wordsearches.orgId, user.orgId))
      .orderBy(desc(wordsearches.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ value: count() })
      .from(wordsearches)
      .where(eq(wordsearches.orgId, user.orgId)),
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
        type="wordsearches"
        page={page}
        totalPages={totalPages}
        total={total}
        orgId={user.orgId}
        initialLang={orgRow?.language || "lt"}
        title="Word Search"
        icon={Search}
        iconColor="purple"
        basePath="/dashboard/word-search"
      />
    </DashboardContainer>
  )
}
