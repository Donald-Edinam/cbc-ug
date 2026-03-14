import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const userRole = (req.auth?.user as any)?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/register"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  // Allow API auth routes
  if (isApiAuthRoute) return NextResponse.next();

  // Handle authenticated users on login/register pages
  if (isPublicRoute && isLoggedIn && nextUrl.pathname !== "/") {
    if (["ADMIN", "ORGANIZER"].includes(userRole)) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protect Admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!["ADMIN", "ORGANIZER"].includes(userRole)) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  // Protect Dashboard routes
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    // Admins/Organizers should stay in the admin panel, except for shared detail pages
    const isSharedDetail = nextUrl.pathname.startsWith("/dashboard/teams/") || 
                          nextUrl.pathname.startsWith("/dashboard/project");
    
    if (["ADMIN", "ORGANIZER"].includes(userRole) && !isSharedDetail) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  // Special case: / redirect if logged in
  if (nextUrl.pathname === "/" && isLoggedIn) {
    if (["ADMIN", "ORGANIZER"].includes(userRole)) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
