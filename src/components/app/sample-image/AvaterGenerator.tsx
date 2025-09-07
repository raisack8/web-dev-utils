"use client"

import { useState } from "react"
import Image from "next/image"
import { Label } from "@radix-ui/react-label"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AvaterGenerator() {
  const DEFAULT_SIZE_WIDTH = 150
  const [sampleW, setSampleW] = useState<number>(DEFAULT_SIZE_WIDTH)
  return (
    <Card className="w-full px-8 py-4 m-1">
      <p className="text-lg font-medium">アバター画像</p>
      <div className="flex gap-2">
        <Label className="content-center">W:</Label>
        <Input
          type="number"
          defaultValue={DEFAULT_SIZE_WIDTH}
          className="w-24"
          onChange={(e) => setSampleW(Number(e.currentTarget.value))}
          step={10}
        />
      </div>
      <Image
        src={`https://i.pravatar.cc/${sampleW}`}
        width={sampleW}
        height={sampleW}
        alt="画像の読み込みに失敗しました。再読み込みしてください。"
      />
    </Card>
  )
}
