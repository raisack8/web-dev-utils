import Link from "next/link"
import { Button } from "../../../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card"

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lazy Load Overview</CardTitle>
          <CardDescription>
            画面に表示されたコンポーネントのみデータを取得する仕組み
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">📋 概要</h3>
            <p className="text-sm text-muted-foreground">
              Lazy
              Loadは、ユーザーが実際に見ている部分のコンポーネントだけをレンダリング・データ取得することで、初期ロード時間を短縮し、不要なサーバーリクエストを削減する技術です。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">🎯 メリット</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>初期ロード時間の短縮</li>
              <li>不要なサーバーリクエストの削減</li>
              <li>ネットワーク帯域幅の節約</li>
              <li>ユーザー体験の向上</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">🔧 実装方法</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">
                  1. Intersection Observer API
                </h4>
                <p className="text-muted-foreground mb-2">
                  要素が画面（viewport）に表示されているかを検知するブラウザAPIです。
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>{`const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 要素が画面に表示されたときの処理
        setShouldLoad(true)
      }
    })
  },
  { threshold: 0.1 } // 10%表示されたら検知
)`}</code>
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-1">2. 監視対象の指定</h4>
                <p className="text-muted-foreground mb-2">
                  useRefを使って監視したい要素を指定します。
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>{`const cardRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (cardRef.current) {
    // cardRef.currentが存在する場合のみ監視を開始
    // この時点でDOM要素が確実に存在することを確認
    observer.observe(cardRef.current)
  }
  return () => {
    if (cardRef.current) {
      // コンポーネントがアンマウントされる際に監視を解除
      // メモリリークを防ぐために必ず実行する
      observer.unobserve(cardRef.current)
    }
  }
}, [])`}</code>
                </pre>
                <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">
                      cardRef.currentの存在確認:
                    </strong>
                  </p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li>
                      useRefで作成した参照は初期値が
                      <code className="bg-muted px-1 py-0.5 rounded">null</code>
                    </li>
                    <li>
                      コンポーネントがレンダリングされた後にDOM要素が割り当てられる
                    </li>
                    <li>
                      <code className="bg-muted px-1 py-0.5 rounded">
                        if (cardRef.current)
                      </code>
                      で要素の存在を確認してからobserveを実行
                    </li>
                    <li>
                      これにより、DOM要素が存在しない状態でobserveを呼び出すエラーを防ぐ
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-1">3. データ取得の実行</h4>
                <p className="text-muted-foreground mb-2">
                  画面に表示されたタイミングでServer Actionを実行します。
                </p>
                <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                  <code>{`useEffect(() => {
  if (shouldLoad && !result && !isLoading) {
    setIsLoading(true)
    lazyDemo(index).then((data) => {
      setResult(data)
      setIsLoading(false)
    })
  }
}, [shouldLoad, result, isLoading, index])`}</code>
                </pre>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">📊 処理の流れ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-2xl">🛌</span>
                <div>
                  <p className="font-semibold">未実行状態</p>
                  <p className="text-muted-foreground">
                    コンポーネントはレンダリングされているが、データ取得は行われていない
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>↓</span>
                <span className="text-xs">画面にスクロールして表示</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🏃‍♂️‍➡️</span>
                <div>
                  <p className="font-semibold">データ取得中</p>
                  <p className="text-muted-foreground">
                    Intersection Observerが要素の表示を検知し、Server
                    Actionを実行
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>↓</span>
                <span className="text-xs">データ取得完了</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-2xl">🙆‍♂️</span>
                <div>
                  <p className="font-semibold">取得完了</p>
                  <p className="text-muted-foreground">
                    取得したデータを表示し、トースト通知を表示
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">💡 重要なポイント</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>threshold:</strong>{" "}
                要素がどの程度表示されたら検知するかを指定（0.1 = 10%）
              </li>
              <li>
                <strong>cleanup関数:</strong>{" "}
                コンポーネントがアンマウントされる際に監視を解除
              </li>
              <li>
                <strong>状態管理:</strong>{" "}
                shouldLoad、isLoading、resultの3つの状態で制御
              </li>
              <li>
                <strong>重複防止:</strong> 条件分岐でデータの重複取得を防ぐ
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">🚀 使用例</h3>
            <p className="text-sm text-muted-foreground mb-2">
              このデモでは10個のカードコンポーネントを配置しています。初期状態では画面に表示されている最初の2-3個のカードのみがデータを取得し、スクロールするにつれて残りのカードが順次データを取得します。
            </p>
          </div>

          <div className="pt-4">
            <Button variant="default" asChild>
              <Link href="/performance/lazy">デモを見る</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>コード例</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">
                DynamicLazyCard.tsx（完全版）
              </h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{`"use client"

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
      console.log(\`start: \${index}\`)
      lazyDemo(index).then((data) => {
        setResult(data)
        setIsLoading(false)
        console.log(\`end: \${index}\`)
        toast.success(\`データを取得しました。コンポーネントID: \${index}\`)
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
          {result && \`🙆‍♂️\${result}\`}
        </CardContent>
      </Card>
    </div>
  )
}`}</code>
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">使用例（page.tsx）</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                <code>{`export default function Home() {
  return (
    <div className="pt-2 flex flex-col gap-4">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((x) => (
        <DynamicLazyCard key={x} index={x} />
      ))}
    </div>
  )
}`}</code>
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
