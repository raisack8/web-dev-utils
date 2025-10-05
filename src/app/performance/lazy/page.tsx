import Link from "next/link"
import { Label } from "@radix-ui/react-menubar"
import { Toaster } from "sonner"
import DynamicLazyCard from "../../../components/app/performance/DynamicLazyCard"
import { Button } from "../../../components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"

export default function Home() {
  return (
    <>
      <Card className="">
        <CardHeader>
          <CardTitle>Lazy Load</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-2">
            <Label>
              コンポーネントが画面に表示されてからレンダリングされる。
            </Label>
            <Label>
              そうすることによって、不必要なデータをフェッチしない。
            </Label>
            <Label>
              ここでは各Cardコンポーネントのレンダリング時に3秒待つバックエンド処理を行う。
            </Label>
            <Label>処理の流れ: 🛌未実行 → 🏃‍♂️‍➡️データ取得中 → 🙆‍♂️取得完了</Label>
          </div>
          <Button className="rounded-full" variant="outline">
            <Link href="/performance/lazy/overview">Over View</Link>
          </Button>
        </CardContent>
      </Card>
      <div className="pt-2 flex flex-col gap-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((x) => (
          <DynamicLazyCard key={x} index={x} />
        ))}
      </div>
    </>
  )
}
