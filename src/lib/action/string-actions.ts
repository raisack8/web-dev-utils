"use server"

import { del, get, keys, set } from "@/lib/redis/string"

/**
 * Redis Stringの値を設定
 */
export async function setStringValue(key: string, value: string, ttl?: number) {
  try {
    await set(key, value, ttl)
    return { success: true, message: "値を設定しました" }
  } catch (error) {
    console.error("SET error:", error)
    return { success: false, message: "設定に失敗しました" }
  }
}

/**
 * Redis Stringの値を取得
 */
export async function getStringValue(key: string) {
  try {
    const value = await get(key)
    if (value === null) {
      return { success: true, value: null, message: "キーが存在しません" }
    }
    return { success: true, value, message: "値を取得しました" }
  } catch (error) {
    console.error("GET error:", error)
    return { success: false, value: null, message: "取得に失敗しました" }
  }
}

/**
 * Redis Stringの値を削除
 */
export async function deleteStringValue(key: string) {
  try {
    const deletedCount = await del(key)
    if (deletedCount === 0) {
      return { success: true, message: "キーが存在しませんでした" }
    }
    return { success: true, message: "値を削除しました" }
  } catch (error) {
    console.error("DELETE error:", error)
    return { success: false, message: "削除に失敗しました" }
  }
}

/**
 * 指定パターンのすべてのキーとその値を取得
 */
export async function getAllStringValues(pattern: string = "*") {
  try {
    const allKeys = await keys(pattern)

    if (allKeys.length === 0) {
      return { success: true, data: [], message: "データが見つかりません" }
    }

    // 各キーの値を取得
    const data = await Promise.all(
      allKeys.map(async (key) => {
        const value = await get(key)
        return { key, value }
      })
    )

    return {
      success: true,
      data,
      message: `${data.length}件のデータを取得しました`,
    }
  } catch (error) {
    console.error("GET ALL error:", error)
    return { success: false, data: [], message: "取得に失敗しました" }
  }
}
