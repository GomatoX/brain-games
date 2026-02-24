import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

/**
 * AI Provider abstraction.
 *
 * Supports two backends controlled by AI_PROVIDER env var:
 *   - "google-ai"  (default) — uses @google/generative-ai + GOOGLE_AI_API_KEY
 *   - "vertex-ai"            — uses @google-cloud/vertexai + ADC (Workload Identity / gcloud)
 *
 * Both use the same Gemini model and produce identical JSON output.
 */

type AIProvider = "google-ai" | "vertex-ai";

const provider: AIProvider =
  (process.env.AI_PROVIDER as AIProvider) || "google-ai";

/**
 * Check if any AI provider is configured.
 */
export function isAIConfigured(): boolean {
  if (provider === "vertex-ai") {
    return !!process.env.GOOGLE_CLOUD_PROJECT;
  }
  return !!process.env.GOOGLE_AI_API_KEY;
}

/**
 * Generate structured JSON content using the configured AI provider.
 *
 * @param prompt - The text prompt to send
 * @param schema - JSON schema for structured output (Google AI Studio format)
 * @param temperature - Creativity level (0-1)
 * @returns Raw JSON string from the model
 */
export async function generateJSON(
  prompt: string,
  schema: {
    type: "ARRAY";
    items: {
      type: "OBJECT";
      properties: Record<string, { type: "STRING" }>;
      required: string[];
    };
  },
  temperature = 0.8,
): Promise<string> {
  if (provider === "vertex-ai") {
    return generateWithVertexAI(prompt, schema, temperature);
  }
  return generateWithGoogleAI(prompt, schema, temperature);
}

// ─── Google AI Studio ──────────────────────────────────────

async function generateWithGoogleAI(
  prompt: string,
  schema: Parameters<typeof generateJSON>[1],
  temperature: number,
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: Object.fromEntries(
            Object.entries(schema.items.properties).map(([k, v]) => [
              k,
              {
                type:
                  v.type === "STRING" ? SchemaType.STRING : SchemaType.STRING,
              },
            ]),
          ),
          required: schema.items.required,
        },
      },
      temperature,
    },
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// ─── Vertex AI ─────────────────────────────────────────────

async function generateWithVertexAI(
  prompt: string,
  schema: Parameters<typeof generateJSON>[1],
  temperature: number,
): Promise<string> {
  // Dynamic import to avoid requiring the package when using google-ai
  const { VertexAI, SchemaType: VSchemaType } =
    await import("@google-cloud/vertexai");

  const project = process.env.GOOGLE_CLOUD_PROJECT!;
  const location = process.env.GOOGLE_CLOUD_LOCATION || "europe-west1";

  // Support credentials as JSON string (for GitHub Secrets / k8s secrets)
  // or fall back to ADC (GOOGLE_APPLICATION_CREDENTIALS file / Workload Identity)
  const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authOptions: Record<string, any> = {};
  if (credentialsJson) {
    authOptions.credentials = JSON.parse(credentialsJson);
  }

  const vertexAI = new VertexAI({
    project,
    location,
    googleAuthOptions: authOptions,
  });

  const model = vertexAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: VSchemaType.ARRAY,
        items: {
          type: VSchemaType.OBJECT,
          properties: Object.fromEntries(
            Object.entries(schema.items.properties).map(([k]) => [
              k,
              { type: VSchemaType.STRING },
            ]),
          ),
          required: schema.items.required,
        },
      },
      temperature,
    },
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  const response = result.response;

  if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
    throw new Error("Empty response from Vertex AI");
  }

  return response.candidates[0].content.parts[0].text;
}
