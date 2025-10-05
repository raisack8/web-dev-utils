import { Suspense } from "react"
import MemoArea from "@/components/app/memo/MemoArea"
import { getMemos } from "@/lib/action/memo"

export default async function Page() {
  const memos = await getMemos()
  return (
    <Suspense fallback="Loading...">
      <MemoArea memos={memos} />
    </Suspense>
  )
}
