"use server"

import { del, list, put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export interface BlobFile {
  pathname: string
  size: number
  uploadedAt: string
}

// このストアはprivateアクセスで構成されているため、
// 配信は src/app/api/blob/route.ts 経由（認証付きサーバー側フェッチ）で行う
export async function uploadFile(formData: FormData) {
  const file = formData.get("file")

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "ファイルを選択してください" }
  }

  try {
    await put(file.name, file, {
      access: "private",
      addRandomSuffix: true,
    })
    revalidatePath("/blob")
    return { success: true, message: "アップロードしました" }
  } catch (error) {
    console.error("Blob upload error:", error)
    return { success: false, message: "アップロードに失敗しました" }
  }
}

export async function listFiles(): Promise<BlobFile[]> {
  const { blobs } = await list()
  return blobs
    .map((blob) => ({
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt.toISOString(),
    }))
    .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
}

export async function deleteFile(pathname: string) {
  try {
    await del(pathname)
    revalidatePath("/blob")
    return { success: true, message: "削除しました" }
  } catch (error) {
    console.error("Blob delete error:", error)
    return { success: false, message: "削除に失敗しました" }
  }
}
