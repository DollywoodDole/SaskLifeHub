import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/profile", "/marketplace/new", "/notifications", "/finances", "/health", "/utilities"];
const AUTH_ONLY = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/marketplace/new",
    "/notifications/:path*",
    "/finances/:path*",
    "/health/:path*",
    "/utilities/:path*",
    "/auth/login",
    "/auth/signup",
    "/auth/forgot-password",
  ],
};
