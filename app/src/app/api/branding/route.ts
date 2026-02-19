import { NextRequest, NextResponse } from "next/server";
import { directusGetBranding, directusRefresh } from "@/lib/auth";

export async function GET(request: NextRequest) {
  let accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const tokens = await directusRefresh(refreshToken);
      accessToken = tokens.access_token;
    } catch {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }
  }

  try {
    const presets = await directusGetBranding(accessToken);
    return NextResponse.json(presets);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch branding" },
      { status: 500 },
    );
  }
}
