import { ensureConnection, redis } from "./client"

/**
 * Redis String型操作のヘルパー関数群
 * すべての関数は自動的に接続を確立します
 */

// ==================== 基本操作 ====================

/**
 * 文字列値を設定
 * @example
 * await set("user:name", "Alice");
 * await set("config:theme", "dark", 3600); // 1時間後に期限切れ
 */
export async function set(
  key: string,
  value: string,
  ttl?: number
): Promise<string | null> {
  await ensureConnection()
  if (ttl) {
    return await redis.setEx(key, ttl, value)
  }
  return await redis.set(key, value)
}

/**
 * 文字列値を取得
 * @example
 * const name = await get("user:name"); // "Alice"
 */
export async function get(key: string): Promise<string | null> {
  await ensureConnection()
  return await redis.get(key)
}

/**
 * 複数のキーを一度に取得
 * @example
 * const [name, email] = await mGet(["user:name", "user:email"]);
 */
export async function mGet(keys: string[]): Promise<(string | null)[]> {
  await ensureConnection()
  return await redis.mGet(keys)
}

/**
 * 複数のキーを一度に設定
 * @example
 * await mSet({ "user:name": "Alice", "user:email": "alice@example.com" });
 */
export async function mSet(keyValues: Record<string, string>): Promise<string> {
  await ensureConnection()
  return await redis.mSet(keyValues)
}

/**
 * キーが存在しない場合のみ設定
 * @returns true: 設定成功, false: キーが既に存在
 * @example
 * const wasSet = await setNX("lock:resource", "locked"); // ロック取得
 */
export async function setNX(key: string, value: string): Promise<boolean> {
  await ensureConnection()
  const result = await redis.setNX(key, value)
  return result === 1
}

/**
 * 既存の値に文字列を追加
 * @returns 追加後の文字列の長さ
 * @example
 * await set("log", "Start: ");
 * await append("log", "Processing..."); // "Start: Processing..."
 */
export async function append(key: string, value: string): Promise<number> {
  await ensureConnection()
  return await redis.append(key, value)
}

/**
 * 文字列の長さを取得
 * @example
 * await set("message", "Hello");
 * const len = await strLen("message"); // 5
 */
export async function strLen(key: string): Promise<number> {
  await ensureConnection()
  return await redis.strLen(key)
}

/**
 * 文字列の一部を取得（0始まりのインデックス）
 * @example
 * await set("text", "Hello World");
 * const substr = await getRange("text", 0, 4); // "Hello"
 */
export async function getRange(
  key: string,
  start: number,
  end: number
): Promise<string> {
  await ensureConnection()
  const result = await redis.getRange(key, start, end)
  return result || ""
}

/**
 * 文字列の一部を上書き
 * @returns 上書き後の文字列の長さ
 * @example
 * await set("message", "Hello World");
 * await setRange("message", 6, "Redis"); // "Hello Redis"
 */
export async function setRange(
  key: string,
  offset: number,
  value: string
): Promise<number> {
  await ensureConnection()
  return await redis.setRange(key, offset, value)
}

// ==================== 数値操作 ====================

/**
 * 数値を1増やす（アトミック操作）
 * @example
 * await incr("page:views"); // カウンター
 */
export async function incr(key: string): Promise<number> {
  await ensureConnection()
  return await redis.incr(key)
}

/**
 * 数値を指定量増やす
 * @example
 * await incrBy("score", 10); // スコアを10増やす
 */
export async function incrBy(key: string, increment: number): Promise<number> {
  await ensureConnection()
  return await redis.incrBy(key, increment)
}

/**
 * 浮動小数点数を増やす
 * @example
 * await incrByFloat("temperature", 0.5);
 */
export async function incrByFloat(
  key: string,
  increment: number
): Promise<string> {
  await ensureConnection()
  return await redis.incrByFloat(key, increment)
}

/**
 * 数値を1減らす
 * @example
 * await decr("stock:count"); // 在庫カウント
 */
export async function decr(key: string): Promise<number> {
  await ensureConnection()
  return await redis.decr(key)
}

/**
 * 数値を指定量減らす
 * @example
 * await decrBy("credits", 5);
 */
export async function decrBy(key: string, decrement: number): Promise<number> {
  await ensureConnection()
  return await redis.decrBy(key, decrement)
}

// ==================== JSON操作（シリアライズ） ====================

/**
 * オブジェクトをJSONとして保存
 * @example
 * await setJSON("user:1", { name: "Alice", age: 30 }, 3600);
 */
export async function setJSON<T>(
  key: string,
  value: T,
  ttl?: number
): Promise<string | null> {
  await ensureConnection()
  const serialized = JSON.stringify(value)
  if (ttl) {
    return await redis.setEx(key, ttl, serialized)
  }
  return await redis.set(key, serialized)
}

/**
 * JSONとして保存されたオブジェクトを取得
 * @example
 * const user = await getJSON<{ name: string; age: number }>("user:1");
 */
export async function getJSON<T>(key: string): Promise<T | null> {
  await ensureConnection()
  const result = await redis.get(key)
  return result ? JSON.parse(result) : null
}

// ==================== TTL・有効期限管理 ====================

/**
 * キーのTTL（残り有効時間）を取得（秒単位）
 * @returns -2: キーが存在しない, -1: 有効期限なし, 正の値: 残り秒数
 * @example
 * const ttl = await getTTL("session:abc");
 */
export async function getTTL(key: string): Promise<number> {
  await ensureConnection()
  return await redis.ttl(key)
}

/**
 * キーに有効期限を設定（秒単位）
 * @example
 * await expire("session:abc", 1800); // 30分後に期限切れ
 */
export async function expire(key: string, seconds: number): Promise<boolean> {
  await ensureConnection()
  return (await redis.expire(key, seconds)) === 1
}

/**
 * キーに有効期限を設定（ミリ秒単位）
 * @example
 * await pExpire("temp:data", 5000); // 5秒後に期限切れ
 */
export async function pExpire(
  key: string,
  milliseconds: number
): Promise<boolean> {
  await ensureConnection()
  return (await redis.pExpire(key, milliseconds)) === 1
}

/**
 * キーの有効期限を削除（永続化）
 * @example
 * await persist("important:data"); // 有効期限を削除
 */
export async function persist(key: string): Promise<boolean> {
  await ensureConnection()
  return (await redis.persist(key)) === 1
}

// ==================== キー管理 ====================

/**
 * キーが存在するか確認
 * @example
 * const exists = await exists("user:1");
 */
export async function exists(key: string): Promise<boolean> {
  await ensureConnection()
  return (await redis.exists(key)) === 1
}

/**
 * キーを削除
 * @returns 削除されたキーの数
 * @example
 * await del("session:abc");
 */
export async function del(key: string): Promise<number> {
  await ensureConnection()
  return await redis.del(key)
}

/**
 * 複数のキーを削除
 * @returns 削除されたキーの数
 * @example
 * await delMany(["temp:1", "temp:2", "temp:3"]);
 */
export async function delMany(keys: string[]): Promise<number> {
  await ensureConnection()
  return await redis.del(keys)
}

/**
 * キーをリネーム
 * @example
 * await rename("old:key", "new:key");
 */
export async function rename(oldKey: string, newKey: string): Promise<string> {
  await ensureConnection()
  return await redis.rename(oldKey, newKey)
}

/**
 * パターンに一致するキーを検索（本番環境では使用注意）
 * @warning 大規模データでは遅くなるためSCANの使用を推奨
 * @example
 * const keys = await keys("user:*"); // user:で始まる全キー
 */
export async function keys(pattern: string): Promise<string[]> {
  await ensureConnection()
  return await redis.keys(pattern)
}

// ==================== ビット操作 ====================

/**
 * ビット値を設定
 * @example
 * await setBit("login:2024-01-01", 123, 1); // ユーザーID 123 がログイン
 */
export async function setBit(
  key: string,
  offset: number,
  value: 0 | 1
): Promise<number> {
  await ensureConnection()
  return await redis.setBit(key, offset, value)
}

/**
 * ビット値を取得
 * @example
 * const loggedIn = await getBit("login:2024-01-01", 123);
 */
export async function getBit(key: string, offset: number): Promise<number> {
  await ensureConnection()
  return await redis.getBit(key, offset)
}

/**
 * ビットが1の数をカウント
 * @example
 * const count = await bitCount("login:2024-01-01"); // ログインユーザー数
 */
export async function bitCount(key: string): Promise<number> {
  await ensureConnection()
  return await redis.bitCount(key)
}
