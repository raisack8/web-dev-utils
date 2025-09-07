import { Suspense } from "react"
import { getMemos } from "@/actions/memo"
import MemoArea from "@/components/app/memo/MemoArea"

export default async function Page() {
  const memos = await getMemos()
  return (
    <Suspense fallback="Loading...">
      <MemoArea memos={memos} />
    </Suspense>
  )
}
