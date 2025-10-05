"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  getListRange,
  popLeft,
  popRight,
  pushLeft,
  pushRight,
  removeFromList,
} from "@/lib/action/list-actions"

export default function ListPage() {
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [items, setItems] = useState<string[]>([])
  const [length, setLength] = useState(0)
  const [poppedValue, setPoppedValue] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePushLeft = async () => {
    if (!key || !value) {
      toast.error("キーと値を入力してください")
      return
    }

    setLoading(true)
    const result = await pushLeft(key, value)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setValue("")
      await handleGetRange()
    } else {
      toast.error(result.message)
    }
  }

  const handlePushRight = async () => {
    if (!key || !value) {
      toast.error("キーと値を入力してください")
      return
    }

    setLoading(true)
    const result = await pushRight(key, value)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setValue("")
      await handleGetRange()
    } else {
      toast.error(result.message)
    }
  }

  const handlePopLeft = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await popLeft(key)
    setLoading(false)

    setPoppedValue(result.value)

    if (result.success) {
      toast.success(result.message)
      await handleGetRange()
    } else {
      toast.error(result.message)
    }
  }

  const handlePopRight = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await popRight(key)
    setLoading(false)

    setPoppedValue(result.value)

    if (result.success) {
      toast.success(result.message)
      await handleGetRange()
    } else {
      toast.error(result.message)
    }
  }

  const handleGetRange = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await getListRange(key)
    setLoading(false)

    setItems(result.items)
    setLength(result.length)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleRemove = async () => {
    if (!key || !value) {
      toast.error("キーと削除する値を入力してください")
      return
    }

    setLoading(true)
    const result = await removeFromList(key, value)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setValue("")
      await handleGetRange()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redis List型 操作</h1>

      <Card>
        <CardHeader>
          <CardTitle>List型のデータ操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Key Input */}
            <div>
              <Label>Key</Label>
              <Input
                placeholder="例: tasks"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            {/* Value Input */}
            <div>
              <Label>Value</Label>
              <Input
                placeholder="追加する値"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            {/* PUSH Operations */}
            <div>
              <Label>PUSH（追加）</Label>
              <div className="flex gap-4 mt-2">
                <Button onClick={handlePushLeft} disabled={loading}>
                  LPUSH（左側に追加）
                </Button>
                <Button onClick={handlePushRight} disabled={loading}>
                  RPUSH（右側に追加）
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                LPUSH: 先頭に追加 / RPUSH: 末尾に追加
              </p>
            </div>

            {/* POP Operations */}
            <div>
              <Label>POP（取り出し）</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button
                  onClick={handlePopLeft}
                  disabled={loading}
                  variant="secondary"
                >
                  LPOP（左側から取得）
                </Button>
                <Button
                  onClick={handlePopRight}
                  disabled={loading}
                  variant="secondary"
                >
                  RPOP（右側から取得）
                </Button>
                <div className="p-2 bg-muted rounded min-w-[200px]">
                  {poppedValue === null ? (
                    <span className="text-muted-foreground">NULL</span>
                  ) : (
                    <span>{poppedValue}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                LPOP: 先頭から取得 / RPOP: 末尾から取得
              </p>
            </div>

            {/* REMOVE */}
            <div>
              <Label>REMOVE（削除）</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  disabled={loading}
                >
                  値を削除
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                指定した値に一致するすべての要素を削除
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* リスト表示 */}
      <Card>
        <CardHeader>
          <CardTitle>リスト内容（長さ: {length}）</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetRange} disabled={loading}>
            リストを取得
          </Button>

          {items.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2 w-20">Index</th>
                      <th className="text-left p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-mono text-sm text-muted-foreground">
                          {index}
                        </td>
                        <td className="p-2">{item}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">リストが空です</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
