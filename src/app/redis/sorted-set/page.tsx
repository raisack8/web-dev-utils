"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  addToSortedSet,
  getSortedSetMembers,
  getSortedSetRank,
  getSortedSetScore,
  removeFromSortedSet,
} from "@/lib/action/sorted-set-actions"

export default function SortedSetPage() {
  const [key, setKey] = useState("")
  const [member, setMember] = useState("")
  const [score, setScore] = useState("")
  const [members, setMembers] = useState<{ value: string; score: number }[]>([])
  const [count, setCount] = useState(0)
  const [scoreResult, setScoreResult] = useState<number | null>(null)
  const [rankResult, setRankResult] = useState<{
    rank: number | null
    revRank: number | null
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAdd = async () => {
    if (!key || !member || !score) {
      toast.error("キー、メンバー、スコアをすべて入力してください")
      return
    }

    const scoreNum = parseFloat(score)
    if (isNaN(scoreNum)) {
      toast.error("スコアは数値で入力してください")
      return
    }

    setLoading(true)
    const result = await addToSortedSet(key, member, scoreNum)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setMember("")
      setScore("")
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
    const result = await removeFromSortedSet(key, member)
    setLoading(false)

    if (result.success) {
      toast.success(result.message)
      setMember("")
      await handleGetMembers()
    } else {
      toast.error(result.message)
    }
  }

  const handleGetScore = async () => {
    if (!key || !member) {
      toast.error("キーとメンバーを入力してください")
      return
    }

    setLoading(true)
    const result = await getSortedSetScore(key, member)
    setLoading(false)

    setScoreResult(result.score)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const handleGetRank = async () => {
    if (!key || !member) {
      toast.error("キーとメンバーを入力してください")
      return
    }

    setLoading(true)
    const result = await getSortedSetRank(key, member)
    setLoading(false)

    setRankResult({ rank: result.rank, revRank: result.revRank })

    if (result.success) {
      toast.success(result.message)
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
    const result = await getSortedSetMembers(key)
    setLoading(false)

    setMembers(result.members)
    setCount(result.count)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Redis Sorted Set型 操作</h1>

      <Card>
        <CardHeader>
          <CardTitle>Sorted Set型のデータ操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div>
              <Label>Key</Label>
              <Input
                placeholder="例: leaderboard"
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
              <Label>Score</Label>
              <Input
                placeholder="スコア（数値）"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                type="number"
                className="w-full max-w-md mt-2"
              />
            </div>

            <div>
              <Label>ZADD（追加）</Label>
              <div className="flex gap-4 mt-2">
                <Button onClick={handleAdd} disabled={loading}>
                  メンバーを追加
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                スコアでソートされた順序で保存されます
              </p>
            </div>

            <div>
              <Label>ZSCORE（スコア取得）</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button
                  onClick={handleGetScore}
                  disabled={loading}
                  variant="secondary"
                >
                  スコアを取得
                </Button>
                <div className="p-2 bg-muted rounded min-w-[200px]">
                  {scoreResult === null ? (
                    <span className="text-muted-foreground">NULL</span>
                  ) : (
                    <span className="font-semibold">{scoreResult}</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>ZRANK（順位取得）</Label>
              <div className="flex gap-4 items-center mt-2">
                <Button
                  onClick={handleGetRank}
                  disabled={loading}
                  variant="secondary"
                >
                  順位を取得
                </Button>
                <div className="p-2 bg-muted rounded min-w-[200px]">
                  {rankResult === null || rankResult.rank === null ? (
                    <span className="text-muted-foreground">NULL</span>
                  ) : (
                    <div className="text-sm">
                      <div>昇順: {rankResult.rank + 1}位</div>
                      <div>降順: {rankResult.revRank! + 1}位</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label>ZREM（削除）</Label>
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
          <CardTitle>Sorted Set内容（メンバー数: {count}）</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetMembers} disabled={loading}>
            ZRANGE（全取得）
          </Button>

          {members.length > 0 && (
            <div className="mt-4">
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2 w-20">Rank</th>
                      <th className="text-left p-2">Member</th>
                      <th className="text-left p-2 w-32">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-mono text-sm text-muted-foreground">
                          {index + 1}
                        </td>
                        <td className="p-2">{item.value}</td>
                        <td className="p-2 font-semibold">{item.score}</td>
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
