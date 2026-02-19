import { NextRequest, NextResponse } from "next/server";

const hideLanding = process.env.NEXT_PUBLIC_HIDE_LANDING === "true";
const hideRegister = process.env.NEXT_PUBLIC_HIDE_REGISTER === "true";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const { pathname } = request.nextUrl;

  // White-label: redirect landing page to dashboard/login
  if (hideLanding && pathname === "/") {
    const target = accessToken || refreshToken ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // White-label: block self-registration
  if (hideRegister && pathname === "/register") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from login/register
  if (pathname === "/login" || pathname === "/register") {
    if (accessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
