"use server"

import { revalidatePath } from "next/cache"
import {
  deleteCache,
  getCacheByPrefix,
  setCache,
  updateCacheTtl,
} from "@/lib/redis"

export interface Memo {
  id: string
  randomId: string
  content: string
  createdAt: string
  ttl: number // 実際のRedisのTTL値（秒）
}

// 開発環境用のインメモリストレージ（実際にはRedisを使用）
let memoryStorage: Map<string, string> = new Map()
let memoList: string[] = []

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
  await setCache(key, memo, ttl)
  revalidatePath("/memo")
  return memo
}

export async function getMemos() {
  // メモの詳細を取得
  const { keys, values, ttls } = await getCacheByPrefix("memo:*")
  const memos = values
    .map((jsonStr, index) => {
      if (!jsonStr) return null
      const parsed = JSON.parse(jsonStr)
      const memo =
        typeof parsed === "string"
          ? (JSON.parse(parsed) as Memo)
          : (parsed as Memo)
      // キーとTTLを追加
      return { ...memo, id: keys[index], ttl: ttls[index] }
    })
    .filter((memo): memo is Memo & { id: string; ttl: number } => memo !== null)
  console.log(memos)
  return memos
}

export async function deleteMemo(key: string) {
  await deleteCache(key)
  revalidatePath("/memo")
  return { success: true }
}

export async function updateMemoTtl(key: string) {
  const result = await updateCacheTtl(key, 25500)
  if (!result) {
    console.error(`Memo not found for id: ${key}`)
    console.error("Available memo ids:", Array.from(memoryStorage.keys()))
    throw new Error("メモが見つかりません")
  }
  revalidatePath("/memo")
}
