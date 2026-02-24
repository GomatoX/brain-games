import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAIConfigured, generateJSON } from "@/lib/ai-provider";

interface LayoutWord {
  word: string;
  clue: string;
  main_word_index?: number;
}

/**
 * Build a prompt that asks the AI to place crossword words on a grid.
 */
function buildLayoutPrompt(words: LayoutWord[]): string {
  const wordList = words
    .map((w) => `  "${w.word}" (clue: "${w.clue}")`)
    .join("\n");

  return `You are a crossword puzzle layout engine. Place the following ${words.length} words on a crossword grid.

WORDS:
${wordList}

RULES:
- Each word must be placed either "across" (horizontal) or "down" (vertical)
- Words MUST intersect with at least one other word at a shared letter
- At intersection points, the letter in both words must match exactly
- No two words may run parallel and adjacent (side by side)
- No word may overlap another word along the same axis
- x is the column (0-based, left to right), y is the row (0-based, top to bottom)
- For "across" words: letters go from (x, y) to (x + word.length - 1, y)
- For "down" words: letters go from (x, y) to (x, y + word.length - 1)
- Try to make the grid as compact and dense as possible
- Balance the number of across and down words
- All words should be connected (no isolated words)
- Coordinates must be non-negative integers (0 or greater)
- Place ALL ${words.length} words

Return a JSON array with one object per word containing:
- "word": the word (UPPERCASE)
- "x": starting column (integer, 0-based)
- "y": starting row (integer, 0-based)
- "direction": either "across" or "down"`;
}

/**
 * Validate that the AI-generated layout has correct intersections.
 */
function validateLayout(
  placements: { word: string; x: number; y: number; direction: string }[],
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const grid: Record<string, { letter: string; wordIdx: number }[]> = {};

  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    const dx = p.direction === "across" ? 1 : 0;
    const dy = p.direction === "down" ? 1 : 0;

    for (let j = 0; j < p.word.length; j++) {
      const cx = p.x + dx * j;
      const cy = p.y + dy * j;
      const key = `${cx},${cy}`;
      const letter = p.word[j];

      if (!grid[key]) grid[key] = [];

      // Check for letter conflicts
      for (const existing of grid[key]) {
        if (existing.letter !== letter) {
          errors.push(
            `Conflict at (${cx},${cy}): "${p.word}" has '${letter}' but "${placements[existing.wordIdx].word}" has '${existing.letter}'`,
          );
        }
      }

      grid[key].push({ letter, wordIdx: i });
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI generation is not configured" },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const words: LayoutWord[] = body.words;

    if (!words?.length || words.length < 2) {
      return NextResponse.json(
        { error: "At least 2 words are required" },
        { status: 400 },
      );
    }

    const upperWords = words.map((w) => ({
      ...w,
      word: w.word.toUpperCase(),
    }));

    const prompt = buildLayoutPrompt(upperWords);

    const schema = {
      type: "ARRAY" as const,
      items: {
        type: "OBJECT" as const,
        properties: {
          word: { type: "STRING" as const },
          x: { type: "STRING" as const },
          y: { type: "STRING" as const },
          direction: { type: "STRING" as const },
        },
        required: ["word", "x", "y", "direction"],
      },
    };

    const text = await generateJSON(prompt, schema, 0.3);

    let placements: {
      word: string;
      x: number;
      y: number;
      direction: string;
    }[];
    try {
      const raw = JSON.parse(text);
      placements = raw.map(
        (p: { word: string; x: string; y: string; direction: string }) => ({
          word: p.word.toUpperCase(),
          x: parseInt(String(p.x), 10),
          y: parseInt(String(p.y), 10),
          direction: p.direction.toLowerCase(),
        }),
      );
    } catch {
      console.error("Failed to parse AI layout response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI layout response" },
        { status: 502 },
      );
    }

    // Normalize: ensure min x/y is 0
    const minX = Math.min(...placements.map((p) => p.x));
    const minY = Math.min(...placements.map((p) => p.y));
    for (const p of placements) {
      p.x -= minX;
      p.y -= minY;
    }

    // Validate intersections
    const validation = validateLayout(placements);

    // Calculate stats
    const gridCells: Set<string> = new Set();
    let letterCount = 0;
    for (const p of placements) {
      const dx = p.direction === "across" ? 1 : 0;
      const dy = p.direction === "down" ? 1 : 0;
      for (let i = 0; i < p.word.length; i++) {
        gridCells.add(`${p.x + dx * i},${p.y + dy * i}`);
      }
      letterCount += p.word.length;
    }
    const maxX = Math.max(
      ...placements.map((p) =>
        p.direction === "across" ? p.x + p.word.length - 1 : p.x,
      ),
    );
    const maxY = Math.max(
      ...placements.map((p) =>
        p.direction === "down" ? p.y + p.word.length - 1 : p.y,
      ),
    );
    const gridWidth = maxX + 1;
    const gridHeight = maxY + 1;
    const area = gridWidth * gridHeight;
    const density = gridCells.size / area;

    const acrossCount = placements.filter(
      (p) => p.direction === "across",
    ).length;
    const downCount = placements.filter((p) => p.direction === "down").length;

    // Map back clues and main_word_index
    const result = placements.map((p) => {
      const original = upperWords.find((w) => w.word === p.word);
      return {
        word: p.word,
        clue: original?.clue || "",
        main_word_index: original?.main_word_index,
        x: p.x,
        y: p.y,
        direction: p.direction,
      };
    });

    return NextResponse.json({
      words: result,
      valid: validation.valid,
      aiGenerated: true,
      stats: {
        density: Math.round(density * 100),
        balance: Math.abs(acrossCount - downCount),
        area,
        wordsPlaced: placements.length,
        totalWords: words.length,
        errors: validation.errors,
      },
    });
  } catch (err) {
    console.error("AI layout generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate AI layout" },
      { status: 500 },
    );
  }
}
