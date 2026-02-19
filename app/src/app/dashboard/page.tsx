import { getAuthenticatedUser } from "@/lib/auth-server";
import { db } from "@/db";
import { crosswords, wordgames, sudoku } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();

  const [cw, wg, sd] = await Promise.all([
    db
      .select()
      .from(crosswords)
      .where(eq(crosswords.userId, user.id))
      .orderBy(desc(crosswords.createdAt)),
    db
      .select()
      .from(wordgames)
      .where(eq(wordgames.userId, user.id))
      .orderBy(desc(wordgames.createdAt)),
    db
      .select()
      .from(sudoku)
      .where(eq(sudoku.userId, user.id))
      .orderBy(desc(sudoku.createdAt)),
  ]);

  // Map to frontend-compatible shape
  const games = {
    crosswords: cw.map(mapGame),
    wordgames: wg.map(mapGame),
    sudoku: sd.map(mapGame),
  };

  return <DashboardContent initialGames={games} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGame(row: any) {
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
    scheduled_date: row.scheduledDate,
    branding: row.brandingId,
    user_created: row.userId,
    date_created: row.createdAt,
    date_updated: row.updatedAt,
  };
}
