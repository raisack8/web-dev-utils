import { createClient } from "redis"

const redis = createClient({
  url: process.env.REDIS_URL!, // redis://default:password@host:port
})

// 接続管理
let isConnected = false

async function ensureConnection() {
  if (!isConnected) {
    await redis.connect()
    isConnected = true
  }
}

export async function setCache(key: string, value: any, ttl?: number) {
  await ensureConnection()
  const serialized = JSON.stringify(value)

  if (ttl) {
    return await redis.setEx(key, ttl, serialized)
  }
  return await redis.set(key, serialized)
}

export async function getCache<T>(key: string): Promise<T | null> {
  await ensureConnection()
  const result = await redis.get(key)
  return result ? JSON.parse(result) : null
}

export async function getCacheByPrefix(
  key: string
): Promise<{ keys: string[]; values: (string | null)[]; ttls: number[] }> {
  await ensureConnection()
  // 前方一致でキーを取得
  const keys = await redis.keys(key)
  if (keys.length === 0) return { keys: [], values: [], ttls: [] }

  // 値とTTLを並行取得
  const [values, ttls] = await Promise.all([
    redis.mGet(keys),
    Promise.all(keys.map((k) => redis.ttl(k))),
  ])

  return { keys, values, ttls }
}

export async function deleteCache(key: string): Promise<number> {
  await ensureConnection()
  // 指定されたキーを削除（戻り値は削除されたキーの数）
  return await redis.del(key)
}

export async function updateCacheTtl(
  key: string,
  ttlSeconds: number
): Promise<boolean> {
  await ensureConnection()
  // 指定されたキーのTTLを更新（戻り値: 1=成功, 0=キー存在しない）
  const result = await redis.expire(key, ttlSeconds)
  return result === 1
}

// アプリ終了時の cleanup（オプション）
export async function closeRedis() {
  if (isConnected) {
    await redis.quit()
    isConnected = false
  }
}
