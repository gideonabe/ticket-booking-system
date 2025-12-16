import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin")

  if (!sessionCookie && isAdminPage) {
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (sessionCookie && isAdminPage) {
    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString())
      if (sessionData.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
