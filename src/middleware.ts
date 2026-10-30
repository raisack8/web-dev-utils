import { auth } from "@/lib/auth"

// 未ログインは全ページ・APIを /auth へ飛ばす(/api/auth と静的ファイルは除外)
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/auth") {
    const url = new URL("/auth", req.nextUrl.origin)
    url.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return Response.redirect(url)
  }
})

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}
