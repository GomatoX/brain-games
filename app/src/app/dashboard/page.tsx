import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import { crosswords, wordgames, wordsearches, sudoku } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import DashboardContent from "@/components/DashboardContent"
import DashboardContainer from "@/components/DashboardContainer"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()
  await promoteScheduledGames()

  const [cwCount, wgCount, wsCount, sdCount] = await Promise.all([
    db.select({ value: count() }).from(crosswords).where(eq(crosswords.orgId, user.orgId)),
    db.select({ value: count() }).from(wordgames).where(eq(wordgames.orgId, user.orgId)),
    db.select({ value: count() }).from(wordsearches).where(eq(wordsearches.orgId, user.orgId)),
    db.select({ value: count() }).from(sudoku).where(eq(sudoku.orgId, user.orgId)),
  ])

  return (
    <DashboardContainer>
      <DashboardContent
        counts={{
          crosswords: Number(cwCount[0]?.value ?? 0),
          wordgames: Number(wgCount[0]?.value ?? 0),
          wordsearches: Number(wsCount[0]?.value ?? 0),
          sudoku: Number(sdCount[0]?.value ?? 0),
        }}
      />
    </DashboardContainer>
  )
}
