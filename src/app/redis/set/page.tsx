"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  addToSet,
  checkSetMember,
  getSetMembers,
  removeFromSet,
} from "@/lib/action/set-actions"

export default function SetPage() {
  const [key, setKey] = useState("")
  const [member, setMember] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [count, setCount] = useState(0)
  const [checkResult, setCheckResult] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!key || !member) {
      toast.error("キーとメンバーを入力してください")
      return
    }

    setLoading(true)
    const result = await addToSet(key, member)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setMember("")
      await handleGetMembers()
    } else {
      toast.error(result.message)
    }
  }

  const handleRemove = async () => {
    if (!key || !member) {
      toast.error("キーとメンバーを入力してください")
      return
    }

    setLoading(true)
    const result = await removeFromSet(key, member)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setMember("")
      await handleGetMembers()
    } else {
      toast.error(result.message)
    }
  }

  const handleGetMembers = async () => {
    if (!key) {
      toast.error("キーを入力してください")
      return
    }

    setLoading(true)
    const result = await getSetMembers(key)
    setLoading(false)

    setMembers(result.members)
    setCount(result.count)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleCheck = async () => {
    if (!key || !member) {
      toast.error("キーとメンバーを入力してください")
      return
    }

    setLoading(true)
    const result = await checkSetMember(key, member)
    setLoading(false)

    setCheckResult(result.exists)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redis Set型 操作</h1>

      <Card>
        <CardHeader>
          <CardTitle>Set型のデータ操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div>
              <Label>Key</Label>
              <Input
                placeholder="例: tags"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>Member</Label>
              <Input
                placeholder="メンバーを入力"
                value={member}
                onChange={(e) => setMember(e.target.value)}
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>SADD（追加）</Label>
              <div className="flex gap-4 mt-2">
                <Button onClick={handleAdd} disabled={loading}>
                  メンバーを追加
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                重複するメンバーは追加されません
              </p>
            </div>

            <div>
              <Label>SISMEMBER（存在確認）</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button
                  onClick={handleCheck}
                  disabled={loading}
                  variant="secondary"
                >
                  メンバーを確認
                </Button>
                <div className="p-2 bg-muted rounded min-w-[200px]">
                  {checkResult === null ? (
                    <span className="text-muted-foreground">-</span>
                  ) : checkResult ? (
                    <span className="text-green-600 font-semibold">
                      存在します
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">
                      存在しません
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>SREM（削除）</Label>
              <div className="flex gap-4 mt-2">
                <Button
                  onClick={handleRemove}
                  variant="destructive"
                  disabled={loading}
                >
                  メンバーを削除
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>セット内容（メンバー数: {count}）</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetMembers} disabled={loading}>
            SMEMBERS（全取得）
          </Button>

          {members.length > 0 && (
            <div className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Member</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {members.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">セットが空です</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
