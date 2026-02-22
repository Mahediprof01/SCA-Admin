import { NextRequest, NextResponse } from "next/server"

const SESSION_COOKIE = "admin_session"
const SESSION_VALUE = "authenticated"

export function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)
  const isAuthenticated = session?.value === SESSION_VALUE

  if (request.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
