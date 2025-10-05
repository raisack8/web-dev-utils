import Link from "next/link"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[12px] row-start-2 items-center">
        <Label className="text-lg border-b border-gray-300 mb-2 px-10">
          Performance.
        </Label>
        <Button className="rounded-full">
          <Link href="/performance/lazy">Lazy load</Link>
        </Button>
      </main>
    </div>
  )
}
