import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// proxy는 lib/auth/session.ts와 모듈을 공유하지 않음 — 독립 선언
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url)
    );
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (payload.role !== "admin") {
      return NextResponse.redirect(
        new URL("/login?error=unauthorized", request.url)
      );
    }

    return NextResponse.next();
  } catch {
    // 만료 또는 서명 불일치
    return NextResponse.redirect(
      new URL("/login?error=unauthorized", request.url)
    );
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
