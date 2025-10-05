import Image from "next/image"
import Link from "next/link"
import { Label } from "@radix-ui/react-label"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[12px] row-start-2 items-center">
        <div className="flex items-center gap-4">
          <Image
            src="/redis.png"
            alt="Redis logo"
            width={180}
            height={38}
            priority
          />
        </div>
        <Label className="text-lg border-b border-gray-300 mb-2 px-10">
          Redis Practice.
        </Label>
        <Button className="rounded-full" variant="outline">
          <Link href="/redis/overview">Over View</Link>
        </Button>
        <Label className="text-lg border-b border-gray-300 mb-2 px-10">
          Type
        </Label>
        <Button className="rounded-full">
          <Link href="/redis/string">String</Link>
        </Button>
        <Button className="rounded-full">
          <Link href="/redis/hash">Hash</Link>
        </Button>
        <Button className="rounded-full">
          <Link href="/redis/list">List</Link>
        </Button>
        <Button className="rounded-full">
          <Link href="/redis/set">Set</Link>
        </Button>
        <Button className="rounded-full">
          <Link href="/redis/sorted-set">Sorted Set</Link>
        </Button>
      </main>
    </div>
  )
}
