import { ensureConnection, redis } from "./client"

/**
 * Redis Set型操作のヘルパー関数群
 * Setは重複のない文字列の集合で、集合演算（和・差・積）をサポート
 */

// ==================== 基本操作 ====================

/**
 * セットにメンバーを追加
 * @returns 追加された新しいメンバーの数
 * @example
 * await sAdd("tags", "redis", "database", "cache");
 * await sAdd("tags", "redis"); // 0 (既に存在するため追加されない)
 */
export async function sAdd(key: string, ...members: string[]): Promise<number> {
  await ensureConnection()
  return await redis.sAdd(key, members)
}

/**
 * セットからメンバーを削除
 * @returns 削除されたメンバーの数
 * @example
 * await sRem("tags", "cache");
 */
export async function sRem(key: string, ...members: string[]): Promise<number> {
  await ensureConnection()
  return await redis.sRem(key, members)
}

/**
 * セットのすべてのメンバーを取得
 * @example
 * const tags = await sMembers("tags"); // ["redis", "database", "cache"]
 */
export async function sMembers(key: string): Promise<string[]> {
  await ensureConnection()
  return await redis.sMembers(key)
}

/**
 * セットにメンバーが含まれているか確認
 * @example
 * const exists = await sIsMember("tags", "redis"); // true
 */
export async function sIsMember(key: string, member: string): Promise<boolean> {
  await ensureConnection()
  const result = await redis.sIsMember(key, member)
  return result === 1
}

/**
 * 複数のメンバーがセットに含まれているか一度に確認
 * @returns 各メンバーの存在確認結果（true/false）の配列
 * @example
 * const results = await sMIsMember("tags", ["redis", "mysql", "cache"]);
 * // [true, false, true]
 */
export async function sMIsMember(
  key: string,
  members: string[]
): Promise<boolean[]> {
  await ensureConnection()
  const results = await redis.smIsMember(key, members)
  return results.map((r) => r === 1)
}

/**
 * セットのメンバー数を取得
 * @example
 * const count = await sCard("tags"); // 3
 */
export async function sCard(key: string): Promise<number> {
  await ensureConnection()
  return await redis.sCard(key)
}

/**
 * セットからランダムにメンバーを取得（削除しない）
 * @param count 取得する数（省略時は1つ）
 * @example
 * const random = await sRandMember("tags");
 * const randoms = await sRandMember("tags", 2);
 */
export async function sRandMember(
  key: string,
  count?: number
): Promise<string | string[] | null> {
  await ensureConnection()
  if (count === undefined) {
    const result = await redis.sRandMember(key)
    return result
  }
  const results = await redis.sRandMemberCount(key, count)
  return results
}

/**
 * セットからランダムにメンバーを取り出して削除
 * @param count 取り出す数（省略時は1つ）
 * @example
 * const popped = await sPop("tags"); // ランダムに1つ取り出す
 * const poppedMultiple = await sPop("tags", 2); // ランダムに2つ取り出す
 */
export async function sPop(
  key: string,
  count?: number
): Promise<string | string[] | null> {
  await ensureConnection()
  if (count === undefined) {
    const result = await redis.sPop(key)
    return result
  }
  const results = await redis.sPopCount(key, count)
  return results
}

/**
 * あるセットから別のセットへメンバーを移動
 * @returns true: 移動成功, false: メンバーが存在しない
 * @example
 * await sMove("tags:draft", "tags:published", "redis");
 */
export async function sMove(
  source: string,
  destination: string,
  member: string
): Promise<boolean> {
  await ensureConnection()
  const result = await redis.sMove(source, destination, member)
  return result === 1
}

// ==================== 集合演算 ====================

/**
 * 複数のセットの和集合を取得
 * @example
 * await sAdd("set1", "a", "b", "c");
 * await sAdd("set2", "c", "d", "e");
 * const union = await sUnion(["set1", "set2"]); // ["a", "b", "c", "d", "e"]
 */
export async function sUnion(keys: string[]): Promise<string[]> {
  await ensureConnection()
  return await redis.sUnion(keys)
}

/**
 * 複数のセットの和集合を別のキーに保存
 * @returns 結果セットのメンバー数
 * @example
 * await sUnionStore("result", ["set1", "set2"]);
 */
export async function sUnionStore(
  destination: string,
  keys: string[]
): Promise<number> {
  await ensureConnection()
  return await redis.sUnionStore(destination, keys)
}

/**
 * 複数のセットの積集合（共通要素）を取得
 * @example
 * await sAdd("set1", "a", "b", "c");
 * await sAdd("set2", "b", "c", "d");
 * const inter = await sInter(["set1", "set2"]); // ["b", "c"]
 */
export async function sInter(keys: string[]): Promise<string[]> {
  await ensureConnection()
  return await redis.sInter(keys)
}

/**
 * 複数のセットの積集合を別のキーに保存
 * @returns 結果セットのメンバー数
 * @example
 * await sInterStore("common", ["set1", "set2"]);
 */
export async function sInterStore(
  destination: string,
  keys: string[]
): Promise<number> {
  await ensureConnection()
  return await redis.sInterStore(destination, keys)
}

/**
 * 積集合のメンバー数のみを取得（保存しない）
 * @example
 * const count = await sInterCard(["set1", "set2"]); // 2
 */
export async function sInterCard(
  keys: string[],
  limit?: number
): Promise<number> {
  await ensureConnection()
  if (limit !== undefined) {
    return await redis.sInterCard(keys, limit)
  }
  return await redis.sInterCard(keys)
}

/**
 * セットの差集合を取得（最初のセットから他のセットの要素を除外）
 * @example
 * await sAdd("set1", "a", "b", "c");
 * await sAdd("set2", "b", "c", "d");
 * const diff = await sDiff(["set1", "set2"]); // ["a"]
 */
export async function sDiff(keys: string[]): Promise<string[]> {
  await ensureConnection()
  return await redis.sDiff(keys)
}

/**
 * セットの差集合を別のキーに保存
 * @returns 結果セットのメンバー数
 * @example
 * await sDiffStore("unique", ["set1", "set2"]);
 */
export async function sDiffStore(
  destination: string,
  keys: string[]
): Promise<number> {
  await ensureConnection()
  return await redis.sDiffStore(destination, keys)
}

// ==================== スキャン操作 ====================

// ==================== スキャン操作 ====================
// Note: sScan などの高度な操作は Redis の型定義によっては
// 直接 redis.sScan() などを使用してください

// ==================== JSON操作（シリアライズ） ====================

/**
 * オブジェクトをJSON文字列としてセットに追加
 * @example
 * await sAddJSON("users", { id: 1, name: "Alice" }, { id: 2, name: "Bob" });
 */
export async function sAddJSON<T>(
  key: string,
  ...values: T[]
): Promise<number> {
  await ensureConnection()
  const serialized = values.map((v) => JSON.stringify(v))
  return await redis.sAdd(key, serialized)
}

/**
 * セットのすべてのメンバーをオブジェクトとして取得
 * @example
 * const users = await sMembersJSON<{ id: number; name: string }>("users");
 */
export async function sMembersJSON<T>(key: string): Promise<T[]> {
  await ensureConnection()
  const members = await redis.sMembers(key)
  return members.map((m) => JSON.parse(m))
}

/**
 * オブジェクトがセットに含まれているか確認
 * @example
 * const exists = await sIsMemberJSON("users", { id: 1, name: "Alice" });
 */
export async function sIsMemberJSON<T>(
  key: string,
  value: T
): Promise<boolean> {
  await ensureConnection()
  const serialized = JSON.stringify(value)
  const result = await redis.sIsMember(key, serialized)
  return result === 1
}

/**
 * オブジェクトをセットから削除
 * @example
 * await sRemJSON("users", { id: 1, name: "Alice" });
 */
export async function sRemJSON<T>(
  key: string,
  ...values: T[]
): Promise<number> {
  await ensureConnection()
  const serialized = values.map((v) => JSON.stringify(v))
  return await redis.sRem(key, serialized)
}

/**
 * セットからランダムにオブジェクトを取り出して削除
 * @example
 * const user = await sPopJSON<{ id: number; name: string }>("users");
 */
export async function sPopJSON<T>(key: string): Promise<T | null> {
  await ensureConnection()
  const result = await redis.sPop(key)
  return result ? JSON.parse(result) : null
}

// ==================== ユーティリティ ====================

/**
 * セットが空かどうか確認
 * @example
 * const isEmpty = await sIsEmpty("tags");
 */
export async function sIsEmpty(key: string): Promise<boolean> {
  await ensureConnection()
  const count = await redis.sCard(key)
  return count === 0
}

/**
 * 2つのセットが共通要素を持つか確認
 * @example
 * const hasCommon = await sHasIntersection("set1", "set2");
 */
export async function sHasIntersection(
  key1: string,
  key2: string
): Promise<boolean> {
  await ensureConnection()
  const count = await redis.sInterCard([key1, key2])
  return count > 0
}

/**
 * セットをクリア（すべてのメンバーを削除）
 * @example
 * await sClear("tags");
 */
export async function sClear(key: string): Promise<number> {
  await ensureConnection()
  const members = await redis.sMembers(key)
  if (members.length === 0) return 0
  return await redis.sRem(key, members)
}
