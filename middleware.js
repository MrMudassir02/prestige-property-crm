import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // No token
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    const role = payload.role;

    // =========================
    // ADMIN ROUTES
    // =========================

    if (pathname.startsWith("/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/user/dashboard", request.url));
      }
    }

    // =========================
    // USER ROUTES
    // =========================

    if (pathname.startsWith("/user")) {
      if (role !== "user") {
        return NextResponse.redirect(new URL("/admin/enquiries", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
