import { NextRequest, NextResponse } from "next/server";
import {
  directusLogin,
  directusRegister,
  directusRefresh,
  directusGetMe,
  directusGenerateToken,
  directusRevokeToken,
} from "@/lib/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case "login": {
        const tokens = await directusLogin(body.email, body.password);
        const response = NextResponse.json({ success: true });
        response.cookies.set("access_token", tokens.access_token, {
          ...COOKIE_OPTIONS,
          maxAge: tokens.expires / 1000,
        });
        response.cookies.set("refresh_token", tokens.refresh_token, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60,
        });
        return response;
      }

      case "register": {
        await directusRegister(
          body.email,
          body.password,
          body.firstName,
          body.lastName,
        );
        // Auto-login after registration
        const tokens = await directusLogin(body.email, body.password);
        const response = NextResponse.json({ success: true });
        response.cookies.set("access_token", tokens.access_token, {
          ...COOKIE_OPTIONS,
          maxAge: tokens.expires / 1000,
        });
        response.cookies.set("refresh_token", tokens.refresh_token, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60,
        });
        return response;
      }

      case "logout": {
        const response = NextResponse.json({ success: true });
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }

      case "refresh": {
        const refreshToken = request.cookies.get("refresh_token")?.value;
        if (!refreshToken) {
          return NextResponse.json(
            { error: "No refresh token" },
            { status: 401 },
          );
        }
        const tokens = await directusRefresh(refreshToken);
        const response = NextResponse.json({ success: true });
        response.cookies.set("access_token", tokens.access_token, {
          ...COOKIE_OPTIONS,
          maxAge: tokens.expires / 1000,
        });
        response.cookies.set("refresh_token", tokens.refresh_token, {
          ...COOKIE_OPTIONS,
          maxAge: 7 * 24 * 60 * 60,
        });
        return response;
      }

      case "generate-token": {
        const accessToken = request.cookies.get("access_token")?.value;
        if (!accessToken) {
          return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
          );
        }
        const user = await directusGetMe(accessToken);
        const token = await directusGenerateToken(user.id);
        const response = NextResponse.json({ token });
        response.cookies.set("static_token", token, {
          ...COOKIE_OPTIONS,
          maxAge: 365 * 24 * 60 * 60, // 1 year
        });
        return response;
      }

      case "revoke-token": {
        const accessToken = request.cookies.get("access_token")?.value;
        if (!accessToken) {
          return NextResponse.json(
            { error: "Not authenticated" },
            { status: 401 },
          );
        }
        const user = await directusGetMe(accessToken);
        await directusRevokeToken(user.id);
        const response = NextResponse.json({ success: true });
        response.cookies.delete("static_token");
        return response;
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const staticToken = request.cookies.get("static_token")?.value || null;

  if (!accessToken) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = await directusGetMe(accessToken);
    return NextResponse.json({ user: { ...user, token: staticToken } });
  } catch {
    // Try refreshing
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
      const tokens = await directusRefresh(refreshToken);
      const user = await directusGetMe(tokens.access_token);
      const response = NextResponse.json({
        user: { ...user, token: staticToken },
      });
      response.cookies.set("access_token", tokens.access_token, {
        ...COOKIE_OPTIONS,
        maxAge: tokens.expires / 1000,
      });
      response.cookies.set("refresh_token", tokens.refresh_token, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    } catch {
      const response = NextResponse.json({ user: null }, { status: 401 });
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }
}
