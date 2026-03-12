import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { platformConfig } from "@/lib/platform";

const hideLanding = platformConfig.hideLanding;
const hideRegister = platformConfig.hideRegister;
const allowedIps = platformConfig.allowedIps;

const SESSION_COOKIE = "authjs.session-token";

/**
 * Clear all auth cookies and redirect to login.
 */
function clearAuthAndRedirect(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete("authjs.csrf-token");
  response.cookies.delete("authjs.callback-url");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;

  // ── IP Allowlist ──────────────────────────────────────
  // When ALLOWED_IPS is set, restrict page access to those IPs only.
  // API routes (/api/*) are NOT restricted so embeds work everywhere.
  if (allowedIps.length > 0 && !pathname.startsWith("/api")) {
    const clientIp = getClientIp(request);
    if (!allowedIps.includes(clientIp)) {
      return new NextResponse("Access denied", { status: 403 });
    }
  }

  // White-label: redirect landing page to dashboard/login
  if (hideLanding && pathname === "/") {
    const target = sessionToken ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // White-label: block self-registration
  if (hideRegister && pathname === "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect dashboard routes — validate session via API
  if (pathname.startsWith("/dashboard")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verify session is actually valid by calling the session endpoint
    try {
      const sessionUrl = new URL("/api/auth/session", request.url);
      const res = await fetch(sessionUrl.toString(), {
        headers: { cookie: request.headers.get("cookie") || "" },
      });
      const session = await res.json();

      // If session is empty or has no user, cookie is stale — clear it
      if (!session?.user) {
        return clearAuthAndRedirect(request);
      }
    } catch {
      // If session check fails, let the request through
      // (the page itself will handle auth)
    }
  }

  // Redirect logged-in users away from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (sessionToken) {
      // Verify session is valid before redirecting
      try {
        const sessionUrl = new URL("/api/auth/session", request.url);
        const res = await fetch(sessionUrl.toString(), {
          headers: { cookie: request.headers.get("cookie") || "" },
        });
        const session = await res.json();

        if (session?.user) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Stale cookie — clear it and let them see login
        const response = NextResponse.next();
        response.cookies.delete(SESSION_COOKIE);
        response.cookies.delete("authjs.csrf-token");
        response.cookies.delete("authjs.callback-url");
        return response;
      } catch {
        // If check fails, let them through to login
      }
    }
  }

  return NextResponse.next();
}

/**
 * Extract client IP from request headers.
 * Supports x-forwarded-for (standard reverse proxy header) and x-real-ip.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs: "client, proxy1, proxy2"
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/invite/:path*",
    "/play/:path*",
  ],
};
