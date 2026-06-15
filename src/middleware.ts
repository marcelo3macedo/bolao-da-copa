import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "bolao-copa-2026-super-secret-key"
);

export async function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin/dashboard");
  const isAdminApi =
    request.nextUrl.pathname.startsWith("/api/admin") &&
    !request.nextUrl.pathname.includes("/login") &&
    !request.nextUrl.pathname.includes("/logout");

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    if (isAdminApi)
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (isAdminApi)
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/api/admin/:path*"],
};
