import { getAuthenticatedUser } from "@/lib/auth-server"
import { db } from "@/db"
import {
  crosswords,
  wordgames,
  sudoku,
  wordsearches,
  users,
  organizations,
} from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import DashboardContent from "@/components/DashboardContent"
import { promoteScheduledGames } from "@/lib/schedule-publisher"

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()

  // Auto-promote any scheduled games whose time has passed
  await promoteScheduledGames()

  const [cw, wg, sd, ws, orgRow] = await Promise.all([
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
      .orderBy(desc(crosswords.createdAt)),
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
      .orderBy(desc(wordgames.createdAt)),
    db
      .select({
        id: sudoku.id,
        status: sudoku.status,
        title: sudoku.title,
        difficulty: sudoku.difficulty,
        puzzle: sudoku.puzzle,
        solution: sudoku.solution,
        scheduledDate: sudoku.scheduledDate,
        brandingId: sudoku.brandingId,
        userId: sudoku.userId,
        orgId: sudoku.orgId,
        createdAt: sudoku.createdAt,
        updatedAt: sudoku.updatedAt,
        creatorFirstName: users.firstName,
        creatorLastName: users.lastName,
        creatorEmail: users.email,
      })
      .from(sudoku)
      .innerJoin(users, eq(users.id, sudoku.userId))
      .where(eq(sudoku.orgId, user.orgId))
      .orderBy(desc(sudoku.createdAt)),
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
      .orderBy(desc(wordsearches.createdAt)),
    db
      .select({ language: organizations.defaultLanguage })
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1)
      .then((rows) => rows[0]),
  ]);

  // Map to frontend-compatible shape
  const games = {
    crosswords: cw.map(mapGame),
    wordgames: wg.map(mapGame),
    sudoku: sd.map(mapGame),
    wordsearches: ws.map(mapGame),
  };

  const initialLang = orgRow?.language || "lt"

  return (
    <DashboardContent
      initialGames={games}
      initialLang={initialLang}
      orgId={user.orgId}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGame(row: any) {
  const creatorName =
    [row.creatorFirstName, row.creatorLastName].filter(Boolean).join(" ") ||
    row.creatorEmail ||
    null;

  return {
    id: row.id,
    status: row.status,
    title: row.title,
    difficulty: row.difficulty,
    words: row.words,
    main_word: row.mainWord,
    word: row.word,
    definition: row.definition,
    max_attempts: row.maxAttempts,
    puzzle: row.puzzle,
    solution: row.solution,
    grid_size: row.gridSize,
    scheduled_date: row.scheduledDate,
    branding: row.brandingId,
    user_created: row.userId,
    created_by: creatorName,
    org_id: row.orgId,
    date_created: row.createdAt,
    date_updated: row.updatedAt,
  };
}
