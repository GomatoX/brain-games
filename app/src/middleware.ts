import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { platformConfig } from "@/lib/platform";

const hideLanding = platformConfig.hideLanding;
const hideRegister = platformConfig.hideRegister;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // White-label: redirect landing page to dashboard/login
  if (hideLanding && pathname === "/") {
    // Check for NextAuth session token
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    const target = sessionToken ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // White-label: block self-registration
  if (hideRegister && pathname === "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from login/register
  if (pathname === "/login" || pathname === "/register") {
    const sessionToken =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
