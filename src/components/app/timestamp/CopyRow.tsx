"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

/** ラベル・値・コピーボタンの1行 */
export default function CopyRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success("コピーしました")
    } catch (error) {
      console.error("コピーに失敗しました:", error)
      toast.error("コピーに失敗しました")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">
        {label}
      </span>
      <code className="flex-1 min-w-0 break-all text-sm">{value || "-"}</code>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-0"
        aria-label={`${label}をコピー`}
        disabled={!value}
        onClick={copy}
      >
        <Copy size={14} />
      </Button>
    </div>
  )
}
