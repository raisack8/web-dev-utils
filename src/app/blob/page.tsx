import { Suspense } from "react"
import BlobArea from "@/components/app/blob/BlobArea"
import { listFiles } from "@/lib/action/blob"

// Vercel Blobからデータを取得するため、動的レンダリングを強制
export const dynamic = "force-dynamic"

export default async function Page() {
  const files = await listFiles()
  return (
    <Suspense fallback="Loading...">
      <BlobArea files={files} />
    </Suspense>
  )
}
