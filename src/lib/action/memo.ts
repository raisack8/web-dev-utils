"use server"

import { revalidatePath } from "next/cache"
import { del, get, getTTL, keys, setJSON } from "@/lib/redis/string"

export interface Memo {
  id: string
  randomId: string
  content: string
  createdAt: string
  ttl: number // 実際のRedisのTTL値（秒）
}

export async function saveMemo(
  content: string,
  ttl: number,
  identifier: string | null = null
) {
  const timestamp = Date.now().toString()
  const key = identifier
    ? `memo:${identifier}:${timestamp}`
    : `memo:${timestamp}`
  // ランダム文字列を生成する
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  let randomId = ""
  for (let i = 0; i < 12; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  // JSON 文字列にして登録する（id, ttl除外）
  const memo: Omit<Memo, "id" | "ttl"> = {
    randomId,
    content,
    createdAt: new Date().toISOString(),
  }
  await setJSON(key, memo, ttl)
  revalidatePath("/memo")
  return memo
}

export async function getMemos() {
  // パターンに一致するすべてのキーを取得
  const allKeys = await keys("memo:*")

  if (allKeys.length === 0) {
    return []
  }

  // 各キーの値とTTLを並行取得
  const memos = await Promise.all(
    allKeys.map(async (key) => {
      const jsonStr = await get(key)
      const ttl = await getTTL(key)

      if (!jsonStr) return null

      const parsed = JSON.parse(jsonStr)
      const memo =
        typeof parsed === "string"
          ? (JSON.parse(parsed) as Memo)
          : (parsed as Memo)

      // キーとTTLを追加
      return { ...memo, id: key, ttl }
    })
  )

  return memos.filter(
    (memo): memo is Memo & { id: string; ttl: number } => memo !== null
  )
}

export async function deleteMemo(key: string) {
  await del(key)
  revalidatePath("/memo")
  return { success: true }
}

export async function updateMemoTtl(key: string, value: string) {
  const result = await setJSON(key, JSON.parse(value), 25500)
  if (!result) {
    console.error(`Memo not found for id: ${key}`)
    throw new Error("メモが見つかりません")
  }
  revalidatePath("/memo")
}
