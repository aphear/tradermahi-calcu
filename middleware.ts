import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to API routes for authentication
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Allow access to static files and Next.js internals
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Admin routes need special handling
  if (pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Check for session in cookies or headers
  const sessionCookie = request.cookies.get("tradingSession")
  const authHeader = request.headers.get("x-trading-session")

  // For the root path, we'll let the client-side handle authentication
  // but for all other paths, we need to validate the session
  if (pathname !== "/") {
    // Check if user has a valid session
    if (!sessionCookie && !authHeader) {
      // Redirect to home page where client-side auth will handle activation
      return NextResponse.redirect(new URL("/", request.url))
    }

    // If session exists, validate it
    if (sessionCookie) {
      try {
        const sessionData = JSON.parse(sessionCookie.value)

        // Check if session is expired
        if (new Date(sessionData.expiryTime) < new Date()) {
          // Session expired, redirect to home
          const response = NextResponse.redirect(new URL("/", request.url))
          response.cookies.delete("tradingSession")
          return response
        }
      } catch (error) {
        // Invalid session data, redirect to home
        const response = NextResponse.redirect(new URL("/", request.url))
        response.cookies.delete("tradingSession")
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
