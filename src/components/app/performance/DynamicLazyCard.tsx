"use client"

import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { lazyDemo } from "@/lib/action/lazy-load"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"

export default function DynamicLazyCard({ index }: { index: number }) {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 要素が画面に表示されたかどうかを検知する仕組み
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (cardRef.current) {
      // どの要素を監視するか指定
      observer.observe(cardRef.current)
    }
    return () => {
      if (cardRef.current) {
        // 終了時に監視を解除
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (shouldLoad && !result && !isLoading) {
      setIsLoading(true)
      console.log(`start: ${index}`)
      lazyDemo(index).then((data) => {
        setResult(data)
        setIsLoading(false)
        console.log(`end: ${index}`)
        toast.success(`データを取得しました。コンポーネントID: ${index}`)
      })
    }
  }, [shouldLoad, result, isLoading, index])

  return (
    <div ref={cardRef}>
      <Card className="h-80">
        <CardHeader>
          <CardTitle>Server Card {index}</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl">
          {!shouldLoad && "🛌未実行"}
          {shouldLoad && isLoading && "🏃‍♂️‍➡️データ取得中"}
          {result && `🙆‍♂️${result}`}
        </CardContent>
      </Card>
    </div>
  )
}
