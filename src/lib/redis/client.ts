import { createClient } from "redis"

// グローバルスコープの型定義
const globalForRedis = global as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

// シングルトンパターン: 開発環境でホットリロード時に接続が重複しないようにする
export const redis =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      reconnectStrategy: (retries) => {
        // 最大10回まで再接続を試みる
        if (retries > 10) {
          return new Error("Too many retries")
        }
        // 指数バックオフ: 100ms, 200ms, 400ms...
        return Math.min(retries * 100, 3000)
      },
    },
  })

// 開発環境では接続をグローバルに保存（ホットリロード対策）
if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis
}

// エラーハンドリング
redis.on("error", (err) => {
  console.error("Redis Client Error:", err)
})

redis.on("connect", () => {
  console.log("Redis connected")
})

// 接続を保証する関数
export async function ensureConnection() {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

// アプリ終了時のクリーンアップ
export async function closeRedis() {
  if (redis.isOpen) {
    await redis.quit()
  }
}
