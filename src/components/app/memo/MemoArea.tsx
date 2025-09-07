"use client"

import { Suspense, useEffect, useState, useTransition } from "react"
import { Label } from "@radix-ui/react-label"
import { RefreshCw, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { deleteMemo, saveMemo, updateMemoTtl, type Memo } from "@/actions/memo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function MemoArea({ memos = [] }: { memos?: Memo[] }) {
  const [content, setContent] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [ttl, setTtl] = useState(25200)

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("メモの内容を入力してください")
      return
    }
    try {
      await saveMemo(content, ttl, identifier.trim())
      setContent("")
      setIdentifier("")
      toast.success("メモを保存しました")
    } catch (error) {
      toast.error("メモの保存に失敗しました")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ja-JP")
  }

  const formatExpiryDate = (createdAt: string, ttl: number) => {
    const createdDate = new Date(createdAt)
    const expiryDate = new Date(createdDate.getTime() + ttl * 1000)
    return expiryDate
      .toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/\//g, "/")
  }

  const handleDelete = async (key: string) => {
    try {
      await deleteMemo(key)
      toast.success(`削除しました`)
    } catch (error) {
      toast.error("メモの削除に失敗しました")
    }
  }

  const handleUpdateTtl = async (key: string) => {
    try {
      await updateMemoTtl(key)
      toast.success(`TTLを残り1週間に更新しました`)
    } catch (error) {
      toast.error("メモの更新に失敗しました")
    }
  }

  return (
    <div className="w-full space-y-4">
      <Card className="w-full px-8 py-4 m-1">
        <form action={handleSave}>
          <h2 className="text-lg font-medium mb-2">メモ</h2>
          <Textarea
            placeholder="Type your message here."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <Button type="submit">作成</Button>
            <Input
              type="text"
              placeholder="識別子"
              className="w-32"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <div className="flex items-center">
              <Input
                type="number"
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                className="w-24"
              />
              <Label className="text-xs ml-1">秒</Label>
            </div>
          </div>
        </form>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
        {memos.map((memo, i) => (
          <Card key={i} className="p-4 relative">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(memo.createdAt)}
                  </span>
                  <form action={() => handleUpdateTtl(memo.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                      title="TTLを25200秒に更新"
                    >
                      <RefreshCw size={14} />
                    </Button>
                  </form>
                  <form action={() => handleDelete(memo.id)}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </form>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">
                {memo.content}
              </p>
              <div className="text-xs text-muted-foreground">
                期限: {formatExpiryDate(memo.createdAt, memo.ttl)}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {memos && memos.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          保存されたメモはありません
        </div>
      )}
    </div>
  )
}
