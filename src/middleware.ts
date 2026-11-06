import { NextResponse, type NextRequest } from "next/server"
import { isValidSession, SESSION_COOKIE } from "@/lib/session"

// 未ログインは /auth へ。ログイン用API(/api/passkey)と静的ファイルは除外する。
// Edge Runtime で動くため、ここでは Redis を使わず Cookie の署名だけを検証する
export async function middleware(request: NextRequest) {
  const authenticated = await isValidSession(
    request.cookies.get(SESSION_COOKIE)?.value
  )
  if (authenticated) return NextResponse.next()

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return NextResponse.redirect(new URL("/auth", request.url))
}

export const config = {
  matcher: ["/((?!auth$|api/passkey|_next/static|_next/image|favicon.ico).*)"],
}
