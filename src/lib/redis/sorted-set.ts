import { ensureConnection, redis } from "./client"

/**
 * Redis Sorted Set型操作のヘルパー関数群
 * Sorted Setはスコア付きの順序付き集合（ランキングやリーダーボードに最適）
 */

// ==================== 基本操作 ====================

/**
 * ソート済みセットにメンバーを追加（スコア付き）
 * @returns 追加された新しいメンバーの数
 * @example
 * await zAdd("leaderboard", { score: 100, value: "player1" });
 * await zAdd("leaderboard", [
 *   { score: 200, value: "player2" },
 *   { score: 150, value: "player3" }
 * ]);
 */
export async function zAdd(
  key: string,
  members: { score: number; value: string } | { score: number; value: string }[]
): Promise<number> {
  await ensureConnection()
  return await redis.zAdd(key, members)
}

/**
 * ソート済みセットからメンバーを削除
 * @returns 削除されたメンバーの数
 * @example
 * await zRem("leaderboard", "player1");
 */
export async function zRem(key: string, ...members: string[]): Promise<number> {
  await ensureConnection()
  return await redis.zRem(key, members)
}

/**
 * メンバーのスコアを取得
 * @example
 * const score = await zScore("leaderboard", "player1"); // 100
 */
export async function zScore(
  key: string,
  member: string
): Promise<number | null> {
  await ensureConnection()
  return await redis.zScore(key, member)
}

/**
 * メンバーのランク（順位）を取得（スコアの低い順、0始まり）
 * @example
 * const rank = await zRank("leaderboard", "player1"); // 0 (最下位)
 */
export async function zRank(
  key: string,
  member: string
): Promise<number | null> {
  await ensureConnection()
  return await redis.zRank(key, member)
}

/**
 * メンバーの逆順ランク（順位）を取得（スコアの高い順、0始まり）
 * @example
 * const rank = await zRevRank("leaderboard", "player2"); // 0 (1位)
 */
export async function zRevRank(
  key: string,
  member: string
): Promise<number | null> {
  await ensureConnection()
  return await redis.zRevRank(key, member)
}

/**
 * ソート済みセットのメンバー数を取得
 * @example
 * const count = await zCard("leaderboard"); // 3
 */
export async function zCard(key: string): Promise<number> {
  await ensureConnection()
  return await redis.zCard(key)
}

/**
 * 指定スコア範囲内のメンバー数を取得
 * @example
 * const count = await zCount("leaderboard", 100, 200); // 100〜200点のプレイヤー数
 */
export async function zCount(
  key: string,
  min: number | string,
  max: number | string
): Promise<number> {
  await ensureConnection()
  return await redis.zCount(key, min, max)
}

// ==================== 範囲取得 ====================

/**
 * インデックス範囲でメンバーを取得（スコア昇順）
 * @example
 * const bottom3 = await zRange("leaderboard", 0, 2); // 下位3人
 */
export async function zRange(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  await ensureConnection()
  const result = await redis.zRange(key, start, stop)
  return Array.isArray(result) ? result : []
}

/**
 * インデックス範囲でメンバーとスコアを取得（スコア昇順）
 * @example
 * const result = await zRangeWithScores("leaderboard", 0, 2);
 * // [{ value: "player1", score: 100 }, ...]
 */
export async function zRangeWithScores(
  key: string,
  start: number,
  stop: number
): Promise<{ value: string; score: number }[]> {
  await ensureConnection()
  const result = await redis.zRangeWithScores(key, start, stop)
  return Array.isArray(result) ? result : []
}

/**
 * インデックス範囲でメンバーを取得（スコア降順）
 * @example
 * const top3 = await zRevRange("leaderboard", 0, 2); // 上位3人
 */
export async function zRevRange(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  await ensureConnection()
  const result = await redis.zRevRange(key, start, stop)
  return (Array.isArray(result) ? result : []) as string[]
}

/**
 * インデックス範囲でメンバーとスコアを取得（スコア降順）
 * @example
 * const top3 = await zRevRangeWithScores("leaderboard", 0, 2);
 */
export async function zRevRangeWithScores(
  key: string,
  start: number,
  stop: number
): Promise<{ value: string; score: number }[]> {
  await ensureConnection()
  const result = await redis.zRevRangeWithScores(key, start, stop)
  return (Array.isArray(result) ? result : []) as {
    value: string
    score: number
  }[]
}

/**
 * スコア範囲でメンバーを取得
 * @example
 * const result = await zRangeByScore("leaderboard", 100, 200); // 100〜200点
 * const above150 = await zRangeByScore("leaderboard", 150, "+inf"); // 150点以上
 */
export async function zRangeByScore(
  key: string,
  min: number | string,
  max: number | string
): Promise<string[]> {
  await ensureConnection()
  const result = await redis.zRangeByScore(key, min, max)
  return Array.isArray(result) ? result : []
}

/**
 * スコア範囲でメンバーとスコアを取得
 * @example
 * const result = await zRangeByScoreWithScores("leaderboard", 100, 200);
 */
export async function zRangeByScoreWithScores(
  key: string,
  min: number | string,
  max: number | string
): Promise<{ value: string; score: number }[]> {
  await ensureConnection()
  return await redis.zRangeByScoreWithScores(key, min, max)
}

/**
 * スコア範囲でメンバーを取得（降順）
 * @example
 * const result = await zRevRangeByScore("leaderboard", 200, 100);
 */
export async function zRevRangeByScore(
  key: string,
  max: number | string,
  min: number | string
): Promise<string[]> {
  await ensureConnection()
  const result = await redis.zRevRangeByScore(key, max, min)
  return (Array.isArray(result) ? result : []) as string[]
}

// ==================== スコア操作 ====================

/**
 * メンバーのスコアを増加
 * @returns 増加後のスコア
 * @example
 * await zIncrBy("leaderboard", 10, "player1"); // スコアを10増やす
 */
export async function zIncrBy(
  key: string,
  increment: number,
  member: string
): Promise<number> {
  await ensureConnection()
  return await redis.zIncrBy(key, increment, member)
}

// ==================== 削除操作 ====================

/**
 * インデックス範囲でメンバーを削除
 * @returns 削除されたメンバー数
 * @example
 * await zRemRangeByRank("leaderboard", 0, 2); // 下位3人を削除
 */
export async function zRemRangeByRank(
  key: string,
  start: number,
  stop: number
): Promise<number> {
  await ensureConnection()
  return await redis.zRemRangeByRank(key, start, stop)
}

/**
 * スコア範囲でメンバーを削除
 * @returns 削除されたメンバー数
 * @example
 * await zRemRangeByScore("leaderboard", 0, 50); // 50点以下を削除
 */
export async function zRemRangeByScore(
  key: string,
  min: number | string,
  max: number | string
): Promise<number> {
  await ensureConnection()
  return await redis.zRemRangeByScore(key, min, max)
}

/**
 * 辞書順範囲でメンバーを削除
 * @example
 * await zRemRangeByLex("names", "[a", "[c"); // a〜cで始まる名前を削除
 */
export async function zRemRangeByLex(
  key: string,
  min: string,
  max: string
): Promise<number> {
  await ensureConnection()
  return await redis.zRemRangeByLex(key, min, max)
}

// ==================== POP操作 ====================

/**
 * 最小スコアのメンバーを取り出して削除
 * @param count 取り出す数（省略時は1つ）
 * @example
 * const lowest = await zPopMin("leaderboard"); // 最下位を取り出す
 * const lowest3 = await zPopMin("leaderboard", 3); // 下位3人
 */
export async function zPopMin(
  key: string,
  count?: number
): Promise<
  { value: string; score: number } | { value: string; score: number }[] | null
> {
  await ensureConnection()
  if (count === undefined) {
    const result = await redis.zPopMin(key)
    return result
  }
  const results = await redis.zPopMinCount(key, count)
  return results
}

/**
 * 最大スコアのメンバーを取り出して削除
 * @param count 取り出す数（省略時は1つ）
 * @example
 * const highest = await zPopMax("leaderboard"); // 1位を取り出す
 * const top3 = await zPopMax("leaderboard", 3); // 上位3人
 */
export async function zPopMax(
  key: string,
  count?: number
): Promise<
  { value: string; score: number } | { value: string; score: number }[] | null
> {
  await ensureConnection()
  if (count === undefined) {
    const result = await redis.zPopMax(key)
    return result
  }
  const results = await redis.zPopMaxCount(key, count)
  return results
}

/**
 * 最小スコアのメンバーを取り出す（ブロッキング版）
 * @param timeout タイムアウト秒数
 * @example
 * const result = await bzPopMin(["queue1", "queue2"], 5);
 */
export async function bzPopMin(
  keys: string[],
  timeout: number
): Promise<{ key: string; value: string; score: number } | null> {
  await ensureConnection()
  return await redis.bzPopMin(keys, timeout)
}

/**
 * 最大スコアのメンバーを取り出す（ブロッキング版）
 * @param timeout タイムアウト秒数
 */
export async function bzPopMax(
  keys: string[],
  timeout: number
): Promise<{ key: string; value: string; score: number } | null> {
  await ensureConnection()
  return await redis.bzPopMax(keys, timeout)
}

// ==================== 集合演算 ====================

// ==================== 集合演算 ====================
// Note: zUnionStore, zInterStore などの集合演算は複雑な型定義のため
// 直接 redis.zUnionStore() などを使用してください

// ==================== スキャン操作 ====================
// Note: zScan などは Redis の型定義によっては直接使用してください

// ==================== 辞書順操作 ====================

/**
 * 辞書順範囲でメンバー数を取得
 * @example
 * const count = await zLexCount("names", "[a", "[c"); // a〜cで始まる名前の数
 */
export async function zLexCount(
  key: string,
  min: string,
  max: string
): Promise<number> {
  await ensureConnection()
  return await redis.zLexCount(key, min, max)
}

/**
 * 辞書順範囲でメンバーを取得
 * @example
 * const names = await zRangeByLex("names", "[a", "[c");
 */
export async function zRangeByLex(
  key: string,
  min: string,
  max: string
): Promise<string[]> {
  await ensureConnection()
  return await redis.zRangeByLex(key, min, max)
}

// ==================== ランダム操作 ====================

// ==================== ランダム操作 ====================
// Note: zRandMember などは Redis の型定義によっては直接使用してください

// ==================== ユーティリティ ====================

/**
 * トップNを取得（上位N人）
 * @example
 * const top10 = await zGetTopN("leaderboard", 10);
 */
export async function zGetTopN(
  key: string,
  n: number
): Promise<{ value: string; score: number }[]> {
  await ensureConnection()
  const result = await redis.zRevRangeWithScores(key, 0, n - 1)
  return (Array.isArray(result) ? result : []) as {
    value: string
    score: number
  }[]
}

/**
 * ボトムNを取得（下位N人）
 * @example
 * const bottom10 = await zGetBottomN("leaderboard", 10);
 */
export async function zGetBottomN(
  key: string,
  n: number
): Promise<{ value: string; score: number }[]> {
  await ensureConnection()
  return await redis.zRangeWithScores(key, 0, n - 1)
}

/**
 * メンバーとそのランク・スコアを取得
 * @example
 * const info = await zGetMemberInfo("leaderboard", "player1");
 * // { rank: 2, score: 150, total: 10 }
 */
export async function zGetMemberInfo(
  key: string,
  member: string
): Promise<{ rank: number; score: number; total: number } | null> {
  await ensureConnection()
  const [rank, score, total] = await Promise.all([
    redis.zRevRank(key, member),
    redis.zScore(key, member),
    redis.zCard(key),
  ])

  if (rank === null || score === null) return null

  return { rank, score, total }
}
