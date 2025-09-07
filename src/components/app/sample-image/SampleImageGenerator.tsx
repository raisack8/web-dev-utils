"use client"

import { useDeferredValue, useState } from "react"
import Image from "next/image"
import { Label } from "@radix-ui/react-label"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function SampleImageGenerator() {
  const DEFAULT_SIZE_WIDTH = 300
  const DEFAULT_SIZE_HEIGHT = 200
  const [sampleW, setSampleW] = useState<number>(DEFAULT_SIZE_WIDTH)
  const [sampleH, setSampleH] = useState<number>(DEFAULT_SIZE_HEIGHT)
  const deferredW = useDeferredValue(sampleW)
  const deferredH = useDeferredValue(sampleH)

  return (
    <Card className="w-full px-8 py-4 m-1">
      <div className="flex gap-2">
        <p className="text-lg font-medium">サンプル画像</p>
        <Tooltip>
          <TooltipTrigger>
            <div className="w-6 text-white bg-gray-700 rounded-4xl font-bold">
              i
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>連続で画像を取得するとエラーが発生します。</p>
            <p>その際は時間をおいて再読み込みしてください。</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex gap-2">
        <Label className="content-center">W:</Label>
        <Input
          type="number"
          defaultValue={DEFAULT_SIZE_WIDTH}
          className="w-24"
          onChange={(e) => setSampleW(Number(e.currentTarget.value))}
          step={10}
        />
        <Label className="content-center">H:</Label>
        <Input
          type="number"
          defaultValue={DEFAULT_SIZE_HEIGHT}
          className="w-24"
          onChange={(e) => {
            setSampleH(Number(e.currentTarget.value))
            console.log(e.currentTarget.value)
          }}
          step={10}
        />
      </div>
      <Image
        src={`https://picsum.photos/${deferredW}/${deferredH}`}
        width={sampleW}
        height={sampleH}
        alt="画像の読み込みに失敗しました。"
        onError={() => {
          toast.error(
            "画像の読み込みに失敗しました。時間をおいて読み込んでください。"
          )
        }}
      />
    </Card>
  )
}
