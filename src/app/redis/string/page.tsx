"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  deleteStringValue,
  getAllStringValues,
  getStringValue,
  setStringValue,
} from "@/lib/action/string-actions"

export default function StringPage() {
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [ttl, setTtl] = useState("")
  const [getResult, setGetResult] = useState<string | null>(null)
  const [allData, setAllData] = useState<
    { key: string; value: string | null }[]
  >([])
  const [loading, setLoading] = useState(false)

  const handleSet = async () => {
    if (!key || !value) {
      toast.error("キーと値を入力してください")
      return
    }

    setLoading(true)
    const ttlNumber = ttl ? parseInt(ttl) : undefined
    const result = await setStringValue(key, value, ttlNumber)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setValue("")
      setTtl("")
    } else {
      toast.error(result.message)
    }
  }

  const handleGet = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await getStringValue(key)
    setLoading(false)

    setGetResult(result.value)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleDelete = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await deleteStringValue(key)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setGetResult(null)
    } else {
      toast.error(result.message)
    }
  }

  const handleGetAllData = async () => {
    setLoading(true)
    const result = await getAllStringValues()
    setLoading(false)

    setAllData(result.data)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redis String型 操作</h1>

      <Card>
        <CardHeader>
          <CardTitle>String型のデータ操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Key Input */}
            <div>
              <Label>Key</Label>
              <Input
                placeholder="例: user:name"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            {/* SET */}
            <div>
              <Label>VALUE</Label>
              <div className="flex gap-4 mt-2">
                <Input
                  placeholder="値を入力"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-60"
                />
                <Input
                  placeholder="TTL (秒、オプション)"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  type="number"
                  className="w-40"
                />
                <Button onClick={handleSet} disabled={loading}>
                  SET
                </Button>
              </div>
            </div>

            {/* GET */}
            <div>
              <Label>GET</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button onClick={handleGet} disabled={loading}>
                  GET
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

            {/* DELETE */}
            <div>
              <Label>DELETE</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  disabled={loading}
                >
                  DELETE
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GET ALL DATA */}
      <Card>
        <CardHeader>
          <CardTitle>全データ取得</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetAllData} disabled={loading}>
            GET ALL DATA
          </Button>

          {allData.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                {allData.length}件のデータ
              </p>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Key</th>
                      <th className="text-left p-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allData.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-mono text-sm">{item.key}</td>
                        <td className="p-2">{item.value || "NULL"}</td>
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
