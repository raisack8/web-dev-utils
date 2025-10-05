"use server"

import { lLen, lPop, lPush, lRange, lRem, rPop, rPush } from "@/lib/redis/list"

/**
 * リストの左側（先頭）に要素を追加
 */
export async function pushLeft(key: string, value: string) {
  try {
    const length = await lPush(key, value)
    return {
      success: true,
      length,
      message: `左側に追加しました（長さ: ${length}）`,
    }
  } catch (error) {
    console.error("LPUSH error:", error)
    return { success: false, length: 0, message: "追加に失敗しました" }
  }
}

/**
 * リストの右側（末尾）に要素を追加
 */
export async function pushRight(key: string, value: string) {
  try {
    const length = await rPush(key, value)
    return {
      success: true,
      length,
      message: `右側に追加しました（長さ: ${length}）`,
    }
  } catch (error) {
    console.error("RPUSH error:", error)
    return { success: false, length: 0, message: "追加に失敗しました" }
  }
}

/**
 * リストの左側（先頭）から要素を取り出す
 */
export async function popLeft(key: string) {
  try {
    const value = await lPop(key)
    if (value === null) {
      return { success: true, value: null, message: "リストが空です" }
    }
    return { success: true, value, message: "左側から取り出しました" }
  } catch (error) {
    console.error("LPOP error:", error)
    return { success: false, value: null, message: "取り出しに失敗しました" }
  }
}

/**
 * リストの右側（末尾）から要素を取り出す
 */
export async function popRight(key: string) {
  try {
    const value = await rPop(key)
    if (value === null) {
      return { success: true, value: null, message: "リストが空です" }
    }
    return { success: true, value, message: "右側から取り出しました" }
  } catch (error) {
    console.error("RPOP error:", error)
    return { success: false, value: null, message: "取り出しに失敗しました" }
  }
}

/**
 * リストの全要素を取得
 */
export async function getListRange(key: string) {
  try {
    const items = await lRange(key, 0, -1)
    const length = await lLen(key)
    return {
      success: true,
      items,
      length,
      message: `${items.length}件の要素を取得しました`,
    }
  } catch (error) {
    console.error("LRANGE error:", error)
    return {
      success: false,
      items: [],
      length: 0,
      message: "取得に失敗しました",
    }
  }
}

/**
 * リストから指定値を削除
 */
export async function removeFromList(key: string, value: string) {
  try {
    const count = await lRem(key, 0, value) // 0 = すべて削除
    if (count === 0) {
      return {
        success: true,
        count: 0,
        message: "該当する要素が見つかりませんでした",
      }
    }
    return { success: true, count, message: `${count}件の要素を削除しました` }
  } catch (error) {
    console.error("LREM error:", error)
    return { success: false, count: 0, message: "削除に失敗しました" }
  }
}
