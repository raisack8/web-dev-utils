import { get } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

// ストアがprivateアクセスのため、ブラウザから直接blob URLへアクセスできない。
// サーバー側でBLOB_READ_WRITE_TOKENを使って取得し、ストリームとして中継する
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("pathname")
  const download = request.nextUrl.searchParams.get("download") === "1"

  if (!pathname) {
    return NextResponse.json({ error: "pathname is required" }, { status: 400 })
  }

  const result = await get(pathname, { access: "private" })
  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "not found" }, { status: 404 })
  }

  const headers = new Headers()
  headers.set("Content-Type", result.blob.contentType)
  headers.set("Content-Length", String(result.blob.size))
  headers.set(
    "Content-Disposition",
    `${download ? "attachment" : "inline"}; filename="file"; filename*=UTF-8''${encodeURIComponent(result.blob.pathname)}`
  )

  return new NextResponse(result.stream, { headers })
}
