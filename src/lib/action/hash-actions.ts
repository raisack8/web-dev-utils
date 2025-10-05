"use server"

import { hDel, hGet, hGetAll, hKeys, hSet, hVals } from "@/lib/redis/hash"

/**
 * ハッシュのフィールドに値を設定
 */
export async function setHashField(key: string, field: string, value: string) {
  try {
    await hSet(key, field, value)
    return { success: true, message: "フィールドを設定しました" }
  } catch (error) {
    console.error("HSET error:", error)
    return { success: false, message: "設定に失敗しました" }
  }
}

/**
 * ハッシュのフィールドから値を取得
 */
export async function getHashField(key: string, field: string) {
  try {
    const value = await hGet(key, field)
    if (value === undefined) {
      return { success: true, value: null, message: "フィールドが存在しません" }
    }
    return { success: true, value, message: "値を取得しました" }
  } catch (error) {
    console.error("HGET error:", error)
    return { success: false, value: null, message: "取得に失敗しました" }
  }
}

/**
 * ハッシュのすべてのフィールドと値を取得
 */
export async function getAllHashFields(key: string) {
  try {
    const data = await hGetAll(key)
    const entries = Object.entries(data)

    if (entries.length === 0) {
      return { success: true, data: [], message: "ハッシュが空です" }
    }

    return {
      success: true,
      data: entries.map(([field, value]) => ({ field, value })),
      message: `${entries.length}件のフィールドを取得しました`,
    }
  } catch (error) {
    console.error("HGETALL error:", error)
    return { success: false, data: [], message: "取得に失敗しました" }
  }
}

/**
 * ハッシュのフィールドを削除
 */
export async function deleteHashField(key: string, field: string) {
  try {
    const count = await hDel(key, field)
    if (count === 0) {
      return { success: true, message: "フィールドが存在しませんでした" }
    }
    return { success: true, message: "フィールドを削除しました" }
  } catch (error) {
    console.error("HDEL error:", error)
    return { success: false, message: "削除に失敗しました" }
  }
}

/**
 * ハッシュのすべてのフィールド名を取得
 */
export async function getHashKeys(key: string) {
  try {
    const keys = await hKeys(key)
    return {
      success: true,
      keys,
      message: `${keys.length}件のフィールドを取得しました`,
    }
  } catch (error) {
    console.error("HKEYS error:", error)
    return { success: false, keys: [], message: "取得に失敗しました" }
  }
}
