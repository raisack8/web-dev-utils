import { createClient } from "redis"

// グローバルスコープの型定義
const globalForRedis = global as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

// ビルド時かどうかを判定（CI環境やNEXT_PHASEをチェック）
const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.CI === "true"

// シングルトンパターン: 開発環境でホットリロード時に接続が重複しないようにする
// ビルド時にはクライアントを作成しない（型アサーションで常にnon-nullとして扱う）
export const redis = (globalForRedis.redis ||
  (!isBuildTime
    ? createClient({
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
    : null)) as ReturnType<typeof createClient>

// 開発環境では接続をグローバルに保存（ホットリロード対策）
if (process.env.NODE_ENV !== "production" && redis) {
  globalForRedis.redis = redis
}

// イベントリスナーが既に登録されているかを追跡
let listenersRegistered = false

// 接続を保証する関数
export async function ensureConnection() {
  // ビルド時は何もしない
  if (!redis) {
    return
  }

  // イベントリスナーを一度だけ登録
  if (!listenersRegistered) {
    redis.on("error", (err) => {
      console.error("Redis Client Error:", err)
    })

    redis.on("connect", () => {
      console.log("Redis connected")
    })

    listenersRegistered = true
  }

  if (!redis.isOpen) {
    await redis.connect()
  }
}

// アプリ終了時のクリーンアップ
export async function closeRedis() {
  if (redis && redis.isOpen) {
    await redis.quit()
  }
}
