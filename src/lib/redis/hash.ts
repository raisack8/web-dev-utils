import { ensureConnection, redis } from "./client"

/**
 * Redis Hash型操作のヘルパー関数群
 * Hashはフィールドと値のペアを持つマップ構造（オブジェクトのような構造）
 */

// ==================== 基本操作 ====================

/**
 * ハッシュのフィールドに値を設定
 * @returns 新規フィールドの場合1、既存フィールド更新の場合0
 * @example
 * await hSet("user:1", "name", "Alice");
 * await hSet("user:1", "age", "30");
 */
export async function hSet(
  key: string,
  field: string,
  value: string | number
): Promise<number> {
  await ensureConnection()
  return await redis.hSet(key, field, value)
}

/**
 * ハッシュのフィールドから値を取得
 * @example
 * const name = await hGet("user:1", "name"); // "Alice"
 */
export async function hGet(
  key: string,
  field: string
): Promise<string | undefined> {
  await ensureConnection()
  const result = await redis.hGet(key, field)
  return result ?? undefined
}

/**
 * ハッシュに複数のフィールドを一度に設定
 * @example
 * await hMSet("user:1", { name: "Alice", age: "30", city: "Tokyo" });
 */
export async function hMSet(
  key: string,
  data: Record<string, string | number>
): Promise<number> {
  await ensureConnection()
  return await redis.hSet(key, data)
}

/**
 * ハッシュから複数のフィールドを一度に取得
 * @example
 * const [name, age] = await hMGet("user:1", ["name", "age"]);
 */
export async function hMGet(
  key: string,
  fields: string[]
): Promise<(string | undefined)[]> {
  await ensureConnection()
  const results = await redis.hmGet(key, fields)
  return results.map((r) => r ?? undefined)
}

/**
 * ハッシュのすべてのフィールドと値を取得
 * @example
 * const user = await hGetAll("user:1");
 * // { name: "Alice", age: "30", city: "Tokyo" }
 */
export async function hGetAll(key: string): Promise<Record<string, string>> {
  await ensureConnection()
  return await redis.hGetAll(key)
}

/**
 * ハッシュのフィールドを削除
 * @returns 削除されたフィールド数
 * @example
 * await hDel("user:1", "age"); // ageフィールドを削除
 * await hDel("user:1", "name", "city"); // 複数フィールド削除
 */
export async function hDel(key: string, ...fields: string[]): Promise<number> {
  await ensureConnection()
  return await redis.hDel(key, fields)
}

/**
 * ハッシュにフィールドが存在するか確認
 * @example
 * const exists = await hExists("user:1", "name"); // true
 */
export async function hExists(key: string, field: string): Promise<boolean> {
  await ensureConnection()
  const result = await redis.hExists(key, field)
  return result === 1
}

/**
 * ハッシュのフィールド数を取得
 * @example
 * const count = await hLen("user:1"); // 3
 */
export async function hLen(key: string): Promise<number> {
  await ensureConnection()
  return await redis.hLen(key)
}

/**
 * ハッシュのすべてのフィールド名を取得
 * @example
 * const fields = await hKeys("user:1"); // ["name", "age", "city"]
 */
export async function hKeys(key: string): Promise<string[]> {
  await ensureConnection()
  return await redis.hKeys(key)
}

/**
 * ハッシュのすべての値を取得
 * @example
 * const values = await hVals("user:1"); // ["Alice", "30", "Tokyo"]
 */
export async function hVals(key: string): Promise<string[]> {
  await ensureConnection()
  return await redis.hVals(key)
}

// ==================== 数値操作 ====================

/**
 * ハッシュのフィールド値を整数として増加
 * @example
 * await hSet("user:1", "loginCount", "0");
 * await hIncrBy("user:1", "loginCount", 1); // 1
 * await hIncrBy("user:1", "loginCount", 5); // 6
 */
export async function hIncrBy(
  key: string,
  field: string,
  increment: number
): Promise<number> {
  await ensureConnection()
  return await redis.hIncrBy(key, field, increment)
}

/**
 * ハッシュのフィールド値を浮動小数点数として増加
 * @example
 * await hIncrByFloat("product:1", "rating", 4.5);
 * await hIncrByFloat("product:1", "rating", 0.3); // 4.8
 */
export async function hIncrByFloat(
  key: string,
  field: string,
  increment: number
): Promise<string> {
  await ensureConnection()
  return await redis.hIncrByFloat(key, field, increment)
}

// ==================== 条件付き操作 ====================

/**
 * フィールドが存在しない場合のみ設定
 * @returns true: 設定成功, false: フィールドが既に存在
 * @example
 * await hSetNX("user:1", "email", "alice@example.com");
 * await hSetNX("user:1", "email", "another@example.com"); // false (既に存在)
 */
export async function hSetNX(
  key: string,
  field: string,
  value: string
): Promise<boolean> {
  await ensureConnection()
  const result = await redis.hSetNX(key, field, value)
  return result === 1
}

// ==================== スキャン操作 ====================
// Note: hScan, hRandField などの高度な操作は Redis の型定義によっては
// 直接 redis.hScan() などを使用してください

// ==================== JSON操作（型安全） ====================

/**
 * ハッシュ全体を型付きオブジェクトとして取得
 * @example
 * interface User {
 *   name: string;
 *   age: string;
 *   city: string;
 * }
 * const user = await hGetAllTyped<User>("user:1");
 */
export async function hGetAllTyped<T extends Record<string, string>>(
  key: string
): Promise<T> {
  await ensureConnection()
  return (await redis.hGetAll(key)) as T
}

/**
 * オブジェクトをハッシュとして保存
 * @example
 * await hSetObject("user:1", {
 *   name: "Alice",
 *   age: 30,
 *   email: "alice@example.com"
 * });
 */
export async function hSetObject(
  key: string,
  obj: Record<string, string | number | boolean>
): Promise<number> {
  await ensureConnection()
  const data: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj)) {
    data[k] = String(v)
  }
  return await redis.hSet(key, data)
}

/**
 * ハッシュのフィールドにJSONオブジェクトを保存
 * @example
 * await hSetJSON("user:1", "preferences", { theme: "dark", language: "ja" });
 */
export async function hSetJSON<T>(
  key: string,
  field: string,
  value: T
): Promise<number> {
  await ensureConnection()
  return await redis.hSet(key, field, JSON.stringify(value))
}

/**
 * ハッシュのフィールドからJSONオブジェクトを取得
 * @example
 * const prefs = await hGetJSON<{ theme: string; language: string }>(
 *   "user:1",
 *   "preferences"
 * );
 */
export async function hGetJSON<T>(
  key: string,
  field: string
): Promise<T | null> {
  await ensureConnection()
  const result = await redis.hGet(key, field)
  return result ? JSON.parse(result) : null
}

// ==================== ユーティリティ ====================

/**
 * ハッシュの文字列長を取得
 * @example
 * await hSet("user:1", "bio", "Hello World");
 * const len = await hStrLen("user:1", "bio"); // 11
 */
export async function hStrLen(key: string, field: string): Promise<number> {
  await ensureConnection()
  const result = await redis.hStrLen(key, field)
  return typeof result === "number" ? result : 0
}
