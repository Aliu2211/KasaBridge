import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/forgot-password", "/terms", "/privacy", "/register"]

  // Check if the path is a public route
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Check for authentication token
  const isAuthenticated = request.cookies.has("auth_token")

  // If the user is authenticated and trying to access a public route (like login),
  // redirect them to the chat interface
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/chat", request.url))
  }

  // If the user is not authenticated and trying to access a protected route,
  // redirect them to the login page
  if (!isAuthenticated && !isPublicRoute && path !== "/") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
