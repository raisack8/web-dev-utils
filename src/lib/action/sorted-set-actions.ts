"use server"

import {
  zAdd,
  zCard,
  zRangeWithScores,
  zRank,
  zRem,
  zRevRank,
  zScore,
} from "@/lib/redis/sorted-set"

/**
 * ソート済みセットにメンバーを追加
 */
export async function addToSortedSet(
  key: string,
  member: string,
  score: number
) {
  try {
    const count = await zAdd(key, { score, value: member })
    return {
      success: true,
      count,
      message: count > 0 ? "メンバーを追加しました" : "スコアを更新しました",
    }
  } catch (error) {
    console.error("ZADD error:", error)
    return { success: false, count: 0, message: "追加に失敗しました" }
  }
}

/**
 * ソート済みセットからメンバーを削除
 */
export async function removeFromSortedSet(key: string, member: string) {
  try {
    const count = await zRem(key, member)
    if (count === 0) {
      return {
        success: true,
        count: 0,
        message: "メンバーが存在しませんでした",
      }
    }
    return { success: true, count, message: "メンバーを削除しました" }
  } catch (error) {
    console.error("ZREM error:", error)
    return { success: false, count: 0, message: "削除に失敗しました" }
  }
}

/**
 * メンバーのスコアを取得
 */
export async function getSortedSetScore(key: string, member: string) {
  try {
    const score = await zScore(key, member)
    if (score === null) {
      return { success: true, score: null, message: "メンバーが存在しません" }
    }
    return { success: true, score, message: `スコア: ${score}` }
  } catch (error) {
    console.error("ZSCORE error:", error)
    return { success: false, score: null, message: "取得に失敗しました" }
  }
}

/**
 * メンバーのランク（順位）を取得
 */
export async function getSortedSetRank(key: string, member: string) {
  try {
    const rank = await zRank(key, member)
    const revRank = await zRevRank(key, member)

    if (rank === null || revRank === null) {
      return {
        success: true,
        rank: null,
        revRank: null,
        message: "メンバーが存在しません",
      }
    }

    return {
      success: true,
      rank,
      revRank,
      message: `昇順: ${rank + 1}位 / 降順: ${revRank + 1}位`,
    }
  } catch (error) {
    console.error("ZRANK error:", error)
    return {
      success: false,
      rank: null,
      revRank: null,
      message: "取得に失敗しました",
    }
  }
}

/**
 * ソート済みセットのすべてのメンバーを取得（スコア降順）
 */
export async function getSortedSetMembers(key: string) {
  try {
    const members = await zRangeWithScores(key, 0, -1)
    const count = await zCard(key)

    if (members.length === 0) {
      return { success: true, members: [], count: 0, message: "セットが空です" }
    }

    // スコア降順でソート
    const sorted = [...members].sort((a, b) => b.score - a.score)

    return {
      success: true,
      members: sorted,
      count,
      message: `${members.length}件のメンバーを取得しました`,
    }
  } catch (error) {
    console.error("ZRANGE error:", error)
    return {
      success: false,
      members: [],
      count: 0,
      message: "取得に失敗しました",
    }
  }
}
