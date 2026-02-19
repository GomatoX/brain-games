import { NextRequest, NextResponse } from "next/server";
import { directusGetMe, directusRefresh } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8055";

async function getAccessToken(request: NextRequest): Promise<string | null> {
  let accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) return null;

    try {
      const tokens = await directusRefresh(refreshToken);
      accessToken = tokens.access_token;
    } catch {
      return null;
    }
  }

  return accessToken;
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const me = await directusGetMe(accessToken);
    const res = await fetch(
      `${API_URL}/items/user_settings?filter[user_created][_eq]=${me.id}&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    if (!res.ok) {
      // Collection might not exist yet — return defaults
      return NextResponse.json({ language: "lt", default_branding: null });
    }

    const json = await res.json();
    const item = json.data?.[0];

    return NextResponse.json(
      item || { language: "lt", default_branding: null },
    );
  } catch {
    return NextResponse.json({ language: "lt", default_branding: null });
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const me = await directusGetMe(accessToken);

    // Check if settings already exist for this user
    const checkRes = await fetch(
      `${API_URL}/items/user_settings?filter[user_created][_eq]=${me.id}&limit=1`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const checkJson = await checkRes.json().catch(() => ({ data: [] }));
    const existing = checkJson.data?.[0];

    const payload = {
      language: body.language || "lt",
      default_branding: body.default_branding || null,
    };

    if (existing) {
      // Update
      const res = await fetch(`${API_URL}/items/user_settings/${existing.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.errors?.[0]?.message || "Failed to update settings",
        );
      }

      const result = await res.json();
      return NextResponse.json(result.data);
    } else {
      // Create
      const res = await fetch(`${API_URL}/items/user_settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          err?.errors?.[0]?.message || "Failed to create settings",
        );
      }

      const result = await res.json();
      return NextResponse.json(result.data);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
