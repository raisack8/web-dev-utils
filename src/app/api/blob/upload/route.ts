import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { type NextRequest, NextResponse } from "next/server"

// 30MB前後のファイルはServer Action(4.5MB上限)を通せないため、
// ブラウザからBlobへ直接アップロードする。ここではそのトークンだけを発行する
const MAX_UPLOAD_SIZE = 100 * 1024 * 1024

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        maximumSizeInBytes: MAX_UPLOAD_SIZE,
        addRandomSuffix: true,
      }),
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Blob client upload error:", error)
    return NextResponse.json(
      { error: "アップロードの準備に失敗しました" },
      { status: 400 }
    )
  }
}
