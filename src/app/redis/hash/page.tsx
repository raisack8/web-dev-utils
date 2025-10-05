"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  deleteHashField,
  getAllHashFields,
  getHashField,
  setHashField,
} from "@/lib/action/hash-actions"

export default function HashPage() {
  const [key, setKey] = useState("")
  const [field, setField] = useState("")
  const [value, setValue] = useState("")
  const [getResult, setGetResult] = useState<string | null>(null)
  const [allData, setAllData] = useState<{ field: string; value: string }[]>([])
  const [loading, setLoading] = useState(false)

  const handleSet = async () => {
    if (!key || !field || !value) {
      toast.error("キー、フィールド、値をすべて入力してください")
      return
    }

    setLoading(true)
    const result = await setHashField(key, field, value)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setField("")
      setValue("")
      await handleGetAll()
    } else {
      toast.error(result.message)
    }
  }

  const handleGet = async () => {
    if (!key || !field) {
      toast.error("キーとフィールドを入力してください")
      return
    }

    setLoading(true)
    const result = await getHashField(key, field)
    setLoading(false)

    setGetResult(result.value)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleGetAll = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await getAllHashFields(key)
    setLoading(false)

    setAllData(result.data)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    if (!key || !field) {
      toast.error("キーとフィールドを入力してください")
      return
    }

    setLoading(true)
    const result = await deleteHashField(key, field)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setField("")
      setGetResult(null)
      await handleGetAll()
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redis Hash型 操作</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hash型のデータ操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div>
              <Label>Key</Label>
              <Input
                placeholder="例: user:1"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>Field</Label>
              <Input
                placeholder="例: name"
                value={field}
                onChange={(e) => setField(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>Value</Label>
              <Input
                placeholder="値を入力"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>HSET</Label>
              <div className="flex gap-4 mt-2">
                <Button onClick={handleSet} disabled={loading}>
                  フィールドを設定
                </Button>
              </div>
            </div>

            <div>
              <Label>HGET</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button onClick={handleGet} disabled={loading}>
                  フィールドを取得
                </Button>
                <div className="p-2 bg-muted rounded min-w-[200px]">
                  {getResult === null ? (
                    <span className="text-muted-foreground">NULL</span>
                  ) : (
                    <span>{getResult}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>HDEL</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={loading}
                >
                  フィールドを削除
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>全フィールド取得</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetAll} disabled={loading}>
            HGETALL
          </Button>

          {allData.length > 0 && (
            <div className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Field</th>
                      <th className="text-left p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-mono text-sm">{item.field}</td>
                        <td className="p-2">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
