// proxy.ts （プロジェクト直下 or src 直下）
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret");
const alg = "HS256";

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, { algorithms: [alg] });
    return payload as { sub?: string; role?: string };
  } catch {
    return null;
  }
}

// 認証が必要なプレフィックス
const PROTECTED_PREFIXES = ["/member", "/admin"];

// ★ Next 16 では関数名は `proxy`
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[proxy] HIT:", pathname);

  // Next.jsの内部・静的系はスルー
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // /member と /admin 以外はスルー
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get("session")?.value;
  const payload = token ? await verifyToken(token) : null;

  // 未ログイン → /auth/login へ
  if (!payload) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // /admin は ADMIN だけ許可
  if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/member/dashboard", request.url));
  }

  return NextResponse.next();
}

// matcher はそのまま使える
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
