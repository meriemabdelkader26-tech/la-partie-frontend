import { NextRequest, NextResponse } from "next/server";

// Public routes that do NOT require authentication
const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/verify-email",
  "/reset-password",
  "/api/request-password-reset",
  "/api/public",
  "/favicon.ico",
  "/unauthorized",
  "/recommendation",
];

// Base route access configuration
type RoleName = "INFLUENCER" | "COMPANY" | "ADMIN";

function extractRoles(rawRole?: string): RoleName[] {
  if (!rawRole) return [];

  const normalized = rawRole.trim().toUpperCase();
  const roles: RoleName[] = [];

  if (normalized.includes("INFLUENCER")) roles.push("INFLUENCER");
  if (normalized.includes("COMPANY")) roles.push("COMPANY");
  if (normalized.includes("ADMIN")) roles.push("ADMIN");

  return roles;
}

function decodeJwtPayload(token?: string): Record<string, unknown> | null {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(Buffer.from(padded, "base64").toString());
  } catch {
    return null;
  }
}

function extractRolesFromPayload(payload: Record<string, unknown> | null) {
  if (!payload) return null;

  const candidateKeys = ["role", "userRole", "user_role", "userType", "type"];
  for (const key of candidateKeys) {
    const value = payload[key];
    if (typeof value === "string") {
      const roles = extractRoles(value);
      if (roles.length > 0) return roles;
    }
  }

  return null;
}

// ✅ Utility to check if a path is allowed for a role
function canAccessPath(pathname: string, roles: RoleName[]): boolean {
  console.log("🔍 Checking access:", { pathname, roles });

  if (roles.length === 0) {
    // Fallback mode: allow authenticated access to non-admin spaces.
    return !pathname.startsWith("/admin");
  }

  const hasAdmin = roles.includes("ADMIN");
  const hasCompany = roles.includes("COMPANY");
  const hasInfluencer = roles.includes("INFLUENCER");

  // Keep admin area strict.
  if (pathname.startsWith("/admin")) {
    const hasAccess = hasAdmin;
    console.log("🔐 Admin route check:", { roles, hasAccess });
    return hasAccess;
  }

  // Company area: allow COMPANY and ADMIN users.
  if (pathname.startsWith("/company")) {
    return hasCompany || hasAdmin;
  }

  // Influencer area: allow INFLUENCER and ADMIN users.
  if (pathname.startsWith("/influencer")) {
    return hasInfluencer || hasAdmin;
  }

  return true;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = req.nextUrl.clone();

  console.log("🚀 Middleware running for:", pathname);

  // Skip _next internal routes and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/.well-known")
  ) {
    console.log("⚙️ Internal/static route, skipping");
    return NextResponse.next();
  }

  // Skip auth for public routes
  if (
    PUBLIC_ROUTES.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    console.log("✅ Public route, allowing access");
    
    // 🧹 SPECIAL CLEANUP: If visiting login or register, we clear tokens to ensure a fresh start.
    // For the landing page (/), we are more cautious to not log out active users, 
    // unless they specifically hit it from a logged-out state (handled in frontend).
    if (pathname === "/login" || pathname === "/register") {
      const res = NextResponse.next();
      const hasToken = req.cookies.has("token") || req.cookies.has("access_token");
      if (hasToken) {
        console.log("🧹 Cleaning old tokens on auth page:", pathname);
        res.cookies.delete("token");
        res.cookies.delete("access_token");
        res.cookies.delete("refreshToken");
        res.cookies.delete("refresh_token");
        res.cookies.delete("userRole");
        res.cookies.delete("isStaff");
      }
      return res;
    }
    
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value || req.cookies.get("token")?.value;
  const refreshToken =
    req.cookies.get("refresh_token")?.value || req.cookies.get("refreshToken")?.value;
  const rawUserRole = req.cookies.get("userRole")?.value;
  const tokenPayload = decodeJwtPayload(token);
  const cookieRoles = extractRoles(rawUserRole);
  const tokenRoles = extractRolesFromPayload(tokenPayload) || [];
  const roleSet = new Set<RoleName>([...cookieRoles, ...tokenRoles]);
  const effectiveRoles = Array.from(roleSet);

  console.log("🍪 Cookies:", {
    hasToken: !!token,
    hasRefresh: !!refreshToken,
    rawUserRole,
    cookieRoles,
    tokenRoles,
    effectiveRoles,
  });

  // No token/refresh -> redirect to login
  if (!token || !refreshToken) {
    console.log("❌ Missing credentials, redirecting to login");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const expValue = typeof tokenPayload?.exp === "number" ? tokenPayload.exp : 0;
    const exp = expValue * 1000;
    const now = Date.now();

    if (now < exp) {
      // Token is still valid
      console.log("✅ Token valid, checking path access");

      const isVerifyByAdmin = tokenPayload?.isVerifyByAdmin === true;
      const isCompletedProfile = tokenPayload?.isCompletedProfile === true;
      const isStaff = tokenPayload?.isStaff === true;

      // Logic for profile completion and admin approval
      if (!isStaff && !effectiveRoles.includes("ADMIN")) {
        // 1. If profile is NOT complete, redirect to complete-profile page
        if (
          !isCompletedProfile &&
          !pathname.includes("/complete-profile") &&
          pathname !== "/pending-approval" &&
          !pathname.startsWith("/api")
        ) {
          const role = effectiveRoles.includes("COMPANY")
            ? "company"
            : "influencer";
          url.pathname = `/${role}/complete-profile`;
          console.log("🔄 Redirecting to complete-profile:", url.pathname);
          return NextResponse.redirect(url);
        }

        // 2. If profile IS complete but NOT verified by admin, we let them proceed to dashboard
        // The PendingApprovalOverlay in the layout will show the "Wait for approval" message
        if (
          isCompletedProfile &&
          !isVerifyByAdmin &&
          !pathname.startsWith("/api") &&
          !pathname.includes("/complete-profile")
        ) {
          // We allow this, but if they are trying to access admin, that's already handled by canAccessPath
          console.log("✅ Pending user, allowing dashboard access (overlay will show)");
        }
      }

      if (!canAccessPath(pathname, effectiveRoles)) {
        console.log("🚫 Access denied, redirecting to /unauthorized");
        url.pathname = "/unauthorized";
        return NextResponse.redirect(url);
      }
      console.log("✅ Access granted");
      const res = NextResponse.next();
      if (effectiveRoles.length > 0) {
        const stableRoleValue =
          effectiveRoles.includes("ADMIN")
            ? "ADMIN"
            : effectiveRoles.includes("COMPANY")
            ? "COMPANY"
            : "INFLUENCER";
        if (!rawUserRole || extractRoles(rawUserRole).length === 0) {
          res.cookies.set("userRole", stableRoleValue, { path: "/" });
        }
      }
      return res;
    }

    console.log("⏰ Token expired, attempting refresh");
    // Token expired → refresh it
    const refreshResponse = await fetch(
      `${req.nextUrl.origin}/api/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!refreshResponse.ok) throw new Error("Refresh failed");

    const data = await refreshResponse.json();
    const newToken = data.token;
    const newRefresh = data.refreshToken;

    const res = NextResponse.next();
    // Keep auth cookies readable on the client because GraphQL headers are built from cookies.
    res.cookies.set("token", newToken, { path: "/" });
    res.cookies.set("access_token", newToken, { path: "/" });
    res.cookies.set("refreshToken", newRefresh, { path: "/" });
    res.cookies.set("refresh_token", newRefresh, { path: "/" });

    console.log("✅ Token refreshed successfully");
    return res;
  } catch (err) {
    console.log("❌ Error in middleware:", err);
    // Refresh failed → clear cookies and redirect to login
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    res.cookies.delete("access_token");
    res.cookies.delete("refreshToken");
    res.cookies.delete("refresh_token");
    res.cookies.delete("userRole");
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
