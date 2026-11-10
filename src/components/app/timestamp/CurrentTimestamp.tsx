"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import CopyRow from "./CopyRow"

// 現在時刻を1秒ごとに更新して表示する
export default function CurrentTimestamp() {
  // SSRとのずれを避けるため、マウント後にだけ時刻を入れる
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now === null ? null : new Date(now)

  return (
    <Card className="w-full px-8 py-4 m-1 space-y-2">
      <h2 className="text-lg font-medium">現在のタイムスタンプ</h2>
      <CopyRow
        label="UNIX秒"
        value={date ? String(Math.floor(date.getTime() / 1000)) : ""}
      />
      <CopyRow label="UNIXミリ秒" value={date ? String(date.getTime()) : ""} />
      <CopyRow label="ISO 8601 (UTC)" value={date ? date.toISOString() : ""} />
    </Card>
  )
}
