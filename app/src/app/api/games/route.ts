import { NextRequest, NextResponse } from "next/server";
import {
  directusGetGames,
  directusCreateGame,
  directusUpdateGame,
  directusDeleteGame,
  directusRefresh,
} from "@/lib/auth";

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
    const games = await directusGetGames(accessToken);
    return NextResponse.json(games);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const { collection, ...data } = body;

    if (!collection) {
      return NextResponse.json(
        { error: "Collection is required" },
        { status: 400 },
      );
    }

    const result = await directusCreateGame(collection, data, accessToken);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
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
    const body = await request.json();
    const { collection, id, ...data } = body;

    if (!collection || !id) {
      return NextResponse.json(
        { error: "Collection and id are required" },
        { status: 400 },
      );
    }

    const result = await directusUpdateGame(collection, id, data, accessToken);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const id = searchParams.get("id");

    if (!collection || !id) {
      return NextResponse.json(
        { error: "Collection and id are required" },
        { status: 400 },
      );
    }

    await directusDeleteGame(collection, id, accessToken);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
