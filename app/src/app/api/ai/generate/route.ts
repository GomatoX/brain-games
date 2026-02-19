import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth } from "@/lib/auth";

const GEMINI_API_KEY = process.env.GOOGLE_AI_API_KEY || "";

interface GenerateRequest {
  mainWord: string;
  wordCount: number;
  difficulty: "easy" | "medium" | "hard";
  language: "lt" | "en";
}

function buildPrompt(req: GenerateRequest): string {
  const difficultyGuide: Record<string, string> = {
    easy: "Use common, everyday words. Write simple, straightforward clues that are easy to understand.",
    medium:
      "Use a mix of common and moderately challenging words. Write descriptive clues that require some thought.",
    hard: "Use advanced, specialized, or uncommon words. Write cryptic or indirect clues that require deep thinking.",
  };

  const langLabel = req.language === "lt" ? "Lithuanian" : "English";

  return `You are a crossword puzzle creator. Generate exactly ${req.wordCount} words related to the main word "${req.mainWord}" for a crossword puzzle.

RULES:
- All words and clues must be in ${langLabel}
- Each word must be a SINGLE word (no spaces, no hyphens)
- Words must be between 3 and 15 characters long
- Words should relate to "${req.mainWord}" thematically
- Each word must have a unique, concise clue (max 80 characters)
- Do NOT include the main word "${req.mainWord}" itself in the list
- All words must be different from each other
- ${difficultyGuide[req.difficulty]}

Return a JSON array of objects with "word" and "clue" fields. Words should be UPPERCASE.`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "AI generation is not configured" },
      { status: 503 },
    );
  }

  try {
    const body: GenerateRequest = await request.json();

    if (!body.mainWord?.trim()) {
      return NextResponse.json(
        { error: "Main word is required" },
        { status: 400 },
      );
    }

    const prompt = buildPrompt({
      mainWord: body.mainWord.trim().toUpperCase(),
      wordCount: Math.min(Math.max(body.wordCount || 8, 3), 20),
      difficulty: body.difficulty || "medium",
      language: body.language || "lt",
    });

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              word: { type: SchemaType.STRING },
              clue: { type: SchemaType.STRING },
            },
            required: ["word", "clue"],
          },
        },
        temperature: 0.8,
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let words: { word: string; clue: string }[];
    try {
      words = JSON.parse(text);
    } catch {
      console.error("Failed to parse Gemini response:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 },
      );
    }

    // Sanitize: uppercase, filter invalid entries
    const sanitized = words
      .filter(
        (w) =>
          w.word &&
          w.clue &&
          w.word.length >= 3 &&
          w.word.length <= 15 &&
          !/\s/.test(w.word),
      )
      .map((w) => ({
        word: w.word.toUpperCase().replace(/[^A-ZĄČĘĖĮŠŲŪŽ]/g, ""),
        clue: w.clue.slice(0, 100),
      }))
      .filter((w) => w.word.length >= 3);

    return NextResponse.json({ words: sanitized });
  } catch (err) {
    console.error("AI generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate words" },
      { status: 500 },
    );
  }
}
