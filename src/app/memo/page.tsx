import { Suspense } from "react"
import MemoArea from "@/components/app/memo/MemoArea"
import { getMemos } from "@/lib/action/memo"

// Redisからデータを取得するため、動的レンダリングを強制
export const dynamic = "force-dynamic"

export default async function Page() {
  const memos = await getMemos()
  return (
    <Suspense fallback="Loading...">
      <MemoArea memos={memos} />
    </Suspense>
  )
}
