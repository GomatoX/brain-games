export type GameType = "crosswords" | "wordgames" | "sudoku" | "wordsearches"

export interface Game {
  id: string | number
  status: string
  title: string
  date_created: string
  date_updated?: string
  scheduled_date?: string | null
  word?: string
  definition?: string
  max_attempts?: number
  difficulty?: string
  words?: {
    word: string
    clue: string
    main_word_index?: number
    x?: number
    y?: number
    direction?: string
  }[]
  main_word?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  puzzle?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  solution?: any
  grid_size?: number
  branding?: string | number | null
  user_created?: string
  created_by?: string | null
  org_id?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapGame = (row: any): Game => {
  const creatorName =
    [row.creatorFirstName, row.creatorLastName].filter(Boolean).join(" ") ||
    row.creatorEmail ||
    null

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
  }
}
