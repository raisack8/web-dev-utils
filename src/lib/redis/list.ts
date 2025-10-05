import { ensureConnection, redis } from "./client"

/**
 * Redis List型操作のヘルパー関数群
 * Listは順序付きの文字列リストで、キューやスタックとして使用可能
 */

// ==================== 基本操作 ====================

/**
 * リストの左側（先頭）に要素を追加
 * @returns リストの長さ
 * @example
 * await lPush("tasks", "task1"); // ["task1"]
 * await lPush("tasks", "task2"); // ["task2", "task1"]
 */
export async function lPush(key: string, ...values: string[]): Promise<number> {
  await ensureConnection()
  return await redis.lPush(key, values)
}

/**
 * リストの右側（末尾）に要素を追加
 * @returns リストの長さ
 * @example
 * await rPush("queue", "item1"); // ["item1"]
 * await rPush("queue", "item2"); // ["item1", "item2"]
 */
export async function rPush(key: string, ...values: string[]): Promise<number> {
  await ensureConnection()
  return await redis.rPush(key, values)
}

/**
 * リストの左側（先頭）から要素を取り出して削除
 * @returns 取り出した要素（リストが空の場合はnull）
 * @example
 * await rPush("queue", "item1", "item2");
 * const item = await lPop("queue"); // "item1"
 */
export async function lPop(key: string): Promise<string | null> {
  await ensureConnection()
  return await redis.lPop(key)
}

/**
 * リストの右側（末尾）から要素を取り出して削除
 * @returns 取り出した要素（リストが空の場合はnull）
 * @example
 * await rPush("stack", "a", "b", "c");
 * const item = await rPop("stack"); // "c" (LIFO: スタック)
 */
export async function rPop(key: string): Promise<string | null> {
  await ensureConnection()
  return await redis.rPop(key)
}

/**
 * リストの長さを取得
 * @example
 * await rPush("list", "a", "b", "c");
 * const len = await lLen("list"); // 3
 */
export async function lLen(key: string): Promise<number> {
  await ensureConnection()
  return await redis.lLen(key)
}

/**
 * リストの指定範囲の要素を取得
 * @param start 開始インデックス（0始まり、負の値は末尾から）
 * @param stop 終了インデックス（-1で末尾まで）
 * @example
 * await rPush("list", "a", "b", "c", "d");
 * const items = await lRange("list", 0, -1); // ["a", "b", "c", "d"]
 * const first2 = await lRange("list", 0, 1); // ["a", "b"]
 */
export async function lRange(
  key: string,
  start: number,
  stop: number
): Promise<string[]> {
  await ensureConnection()
  return await redis.lRange(key, start, stop)
}

/**
 * リスト全体を取得
 * @example
 * const allItems = await lGetAll("list");
 */
export async function lGetAll(key: string): Promise<string[]> {
  await ensureConnection()
  return await redis.lRange(key, 0, -1)
}

/**
 * リストの指定インデックスの要素を取得
 * @example
 * await rPush("list", "a", "b", "c");
 * const item = await lIndex("list", 1); // "b"
 */
export async function lIndex(
  key: string,
  index: number
): Promise<string | null> {
  await ensureConnection()
  return await redis.lIndex(key, index)
}

/**
 * リストの指定インデックスの要素を更新
 * @example
 * await rPush("list", "a", "b", "c");
 * await lSet("list", 1, "B"); // ["a", "B", "c"]
 */
export async function lSet(
  key: string,
  index: number,
  value: string
): Promise<string> {
  await ensureConnection()
  return await redis.lSet(key, index, value)
}

// ==================== 高度な操作 ====================

/**
 * リストから指定した値を削除
 * @param count > 0: 先頭からcount個削除, < 0: 末尾からcount個削除, 0: すべて削除
 * @returns 削除された要素数
 * @example
 * await rPush("list", "a", "b", "a", "c", "a");
 * await lRem("list", 2, "a"); // 先頭から2個の"a"を削除 -> ["b", "c", "a"]
 * await lRem("list", 0, "a"); // すべての"a"を削除 -> ["b", "c"]
 */
export async function lRem(
  key: string,
  count: number,
  value: string
): Promise<number> {
  await ensureConnection()
  return await redis.lRem(key, count, value)
}

/**
 * リストを指定範囲にトリム（範囲外の要素を削除）
 * @example
 * await rPush("list", "a", "b", "c", "d", "e");
 * await lTrim("list", 0, 2); // 最初の3要素のみ残す -> ["a", "b", "c"]
 * // 最新10件のみ保持する場合
 * await lTrim("recent", 0, 9);
 */
export async function lTrim(
  key: string,
  start: number,
  stop: number
): Promise<string> {
  await ensureConnection()
  return await redis.lTrim(key, start, stop)
}

/**
 * リストの指定位置に要素を挿入
 * @param position "BEFORE" | "AFTER"
 * @example
 * await rPush("list", "a", "c");
 * await lInsert("list", "BEFORE", "c", "b"); // ["a", "b", "c"]
 */
export async function lInsert(
  key: string,
  position: "BEFORE" | "AFTER",
  pivot: string,
  value: string
): Promise<number> {
  await ensureConnection()
  return await redis.lInsert(key, position, pivot, value)
}

/**
 * リストの左側に要素を追加（リストが存在する場合のみ）
 * @returns リストの長さ（リストが存在しない場合は0）
 * @example
 * await lPushX("nonexistent", "value"); // 0 (何もしない)
 * await lPush("existing", "a");
 * await lPushX("existing", "b"); // 2 (追加される)
 */
export async function lPushX(
  key: string,
  ...values: string[]
): Promise<number> {
  await ensureConnection()
  return await redis.lPushX(key, values)
}

/**
 * リストの右側に要素を追加（リストが存在する場合のみ）
 * @returns リストの長さ（リストが存在しない場合は0）
 */
export async function rPushX(
  key: string,
  ...values: string[]
): Promise<number> {
  await ensureConnection()
  return await redis.rPushX(key, values)
}

// ==================== ブロッキング操作 ====================

/**
 * リストの左側から要素を取り出す（ブロッキング版）
 * リストが空の場合、指定秒数待機
 * @param timeout タイムアウト秒数（0で無限待機）
 * @example
 * // 他のプロセスがrPushするまで最大5秒待機
 * const item = await blPop("queue", 5);
 */
export async function blPop(
  key: string,
  timeout: number
): Promise<{ key: string; element: string } | null> {
  await ensureConnection()
  return await redis.blPop(key, timeout)
}

/**
 * リストの右側から要素を取り出す（ブロッキング版）
 * @param timeout タイムアウト秒数（0で無限待機）
 */
export async function brPop(
  key: string,
  timeout: number
): Promise<{ key: string; element: string } | null> {
  await ensureConnection()
  return await redis.brPop(key, timeout)
}

/**
 * あるリストから要素をPOPして別のリストにPUSH（アトミック操作）
 * @example
 * // タスクキューから処理中キューへ移動
 * const task = await rPopLPush("tasks:pending", "tasks:processing");
 */
export async function rPopLPush(
  source: string,
  destination: string
): Promise<string | null> {
  await ensureConnection()
  return await redis.rPopLPush(source, destination)
}

/**
 * あるリストから要素をPOPして別のリストにPUSH（ブロッキング版）
 * @param timeout タイムアウト秒数
 * @example
 * // タスクが来るまで待機してから処理中に移動
 * const task = await brPopLPush("tasks:pending", "tasks:processing", 5);
 */
export async function brPopLPush(
  source: string,
  destination: string,
  timeout: number
): Promise<string | null> {
  await ensureConnection()
  return await redis.brPopLPush(source, destination, timeout)
}

// ==================== JSON操作（シリアライズ） ====================

/**
 * オブジェクトをリストに追加（右側）
 * @example
 * await rPushJSON("events", { type: "login", userId: 123 });
 */
export async function rPushJSON<T>(
  key: string,
  ...values: T[]
): Promise<number> {
  await ensureConnection()
  const serialized = values.map((v) => JSON.stringify(v))
  return await redis.rPush(key, serialized)
}

/**
 * オブジェクトをリストに追加（左側）
 * @example
 * await lPushJSON("notifications", { message: "Hello", read: false });
 */
export async function lPushJSON<T>(
  key: string,
  ...values: T[]
): Promise<number> {
  await ensureConnection()
  const serialized = values.map((v) => JSON.stringify(v))
  return await redis.lPush(key, serialized)
}

/**
 * リストからオブジェクトを取得（左側）
 * @example
 * const event = await lPopJSON<{ type: string; userId: number }>("events");
 */
export async function lPopJSON<T>(key: string): Promise<T | null> {
  await ensureConnection()
  const result = await redis.lPop(key)
  return result ? JSON.parse(result) : null
}

/**
 * リストからオブジェクトを取得（右側）
 */
export async function rPopJSON<T>(key: string): Promise<T | null> {
  await ensureConnection()
  const result = await redis.rPop(key)
  return result ? JSON.parse(result) : null
}

/**
 * リストの範囲をオブジェクトの配列として取得
 * @example
 * const events = await lRangeJSON<{ type: string }>("events", 0, 9);
 */
export async function lRangeJSON<T>(
  key: string,
  start: number,
  stop: number
): Promise<T[]> {
  await ensureConnection()
  const results = await redis.lRange(key, start, stop)
  return results.map((r) => JSON.parse(r))
}

/**
 * リスト全体をオブジェクトの配列として取得
 */
export async function lGetAllJSON<T>(key: string): Promise<T[]> {
  await ensureConnection()
  const results = await redis.lRange(key, 0, -1)
  return results.map((r) => JSON.parse(r))
}
