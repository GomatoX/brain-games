import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { crosswords, users, organizations } from "@/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { Grid3x3 } from "lucide-react"
import DashboardContainer from "@/components/DashboardContainer"
import { GameListClient } from "@/components/GameListClient"
import { mapGame } from "@/lib/game-types"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

const PAGE_SIZE = 20

export default async function CrosswordsPage({
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
        id: crosswords.id,
        status: crosswords.status,
        title: crosswords.title,
        difficulty: crosswords.difficulty,
        words: crosswords.words,
        mainWord: crosswords.mainWord,
        scheduledDate: crosswords.scheduledDate,
        brandingId: crosswords.brandingId,
        userId: crosswords.userId,
        orgId: crosswords.orgId,
        createdAt: crosswords.createdAt,
        updatedAt: crosswords.updatedAt,
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
        creatorEmail: users.email,
      })
      .from(crosswords)
      .innerJoin(users, eq(users.id, crosswords.userId))
      .where(eq(crosswords.orgId, user.orgId))
      .orderBy(desc(crosswords.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ value: count() })
      .from(crosswords)
      .where(eq(crosswords.orgId, user.orgId)),
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
        type="crosswords"
        page={page}
        totalPages={totalPages}
        total={total}
        orgId={user.orgId}
        initialLang={orgRow?.language || "lt"}
        title="Crosswords"
        icon={Grid3x3}
        iconColor="blue"
        basePath="/dashboard/crosswords"
      />
    </DashboardContainer>
  )
}
