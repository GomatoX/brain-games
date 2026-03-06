import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * GET /api/auth/logout
 * Clears all auth cookies and redirects to /login.
 * Used when the DB user is stale/missing but the JWT is still valid,
 * which would otherwise cause an infinite redirect loop.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("authjs.session-token");
  response.cookies.delete("authjs.csrf-token");
  response.cookies.delete("authjs.callback-url");
  return response;
}
