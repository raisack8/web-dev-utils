"use server"

import { sAdd, sCard, sIsMember, sMembers, sRem } from "@/lib/redis/set"

/**
 * セットにメンバーを追加
 */
export async function addToSet(key: string, member: string) {
  try {
    const count = await sAdd(key, member)
    if (count === 0) {
      return { success: true, count: 0, message: "既に存在するメンバーです" }
    }
    return { success: true, count, message: "メンバーを追加しました" }
  } catch (error) {
    console.error("SADD error:", error)
    return { success: false, count: 0, message: "追加に失敗しました" }
  }
}

/**
 * セットからメンバーを削除
 */
export async function removeFromSet(key: string, member: string) {
  try {
    const count = await sRem(key, member)
    if (count === 0) {
      return {
        success: true,
        count: 0,
        message: "メンバーが存在しませんでした",
      }
    }
    return { success: true, count, message: "メンバーを削除しました" }
  } catch (error) {
    console.error("SREM error:", error)
    return { success: false, count: 0, message: "削除に失敗しました" }
  }
}

/**
 * セットのすべてのメンバーを取得
 */
export async function getSetMembers(key: string) {
  try {
    const members = await sMembers(key)
    const count = await sCard(key)

    if (members.length === 0) {
      return { success: true, members: [], count: 0, message: "セットが空です" }
    }

    return {
      success: true,
      members,
      count,
      message: `${members.length}件のメンバーを取得しました`,
    }
  } catch (error) {
    console.error("SMEMBERS error:", error)
    return {
      success: false,
      members: [],
      count: 0,
      message: "取得に失敗しました",
    }
  }
}

/**
 * メンバーがセットに含まれているか確認
 */
export async function checkSetMember(key: string, member: string) {
  try {
    const exists = await sIsMember(key, member)
    return {
      success: true,
      exists,
      message: exists ? "メンバーが存在します" : "メンバーが存在しません",
    }
  } catch (error) {
    console.error("SISMEMBER error:", error)
    return { success: false, exists: false, message: "確認に失敗しました" }
  }
}
