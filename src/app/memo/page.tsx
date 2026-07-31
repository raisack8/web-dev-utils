import { Suspense } from "react"
import MemoArea from "@/components/app/memo/MemoArea"
import { getMemos, type Memo } from "@/lib/action/memo"

// Redisからデータを取得するため、動的レンダリングを強制
export const dynamic = "force-dynamic"

export default async function Page() {
  let memos: Memo[] = []
  let loadError = false
  try {
    memos = await getMemos()
  } catch (error) {
    // Redis未接続時にページ全体をクラッシュさせず、フォームは操作できる状態を保つ
    console.error("Failed to load memos:", error)
    loadError = true
  }

  return (
    <Suspense fallback="Loading...">
      {loadError && (
        <div className="mb-4 rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          メモの一覧を取得できませんでした。Redisサーバーに接続できません。
          Vercelの環境変数（REDIS_URL）を確認してください。
        </div>
      )}
      <MemoArea memos={memos} />
    </Suspense>
  )
}
