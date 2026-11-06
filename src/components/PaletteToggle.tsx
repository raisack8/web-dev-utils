"use client"

import { useEffect, useState } from "react"
import { Contrast } from "lucide-react"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "palette"

// 配色を「ライム」と「白黒」で切り替える。選択は端末ごとに記憶する
// (読み込み時のちらつき防止のため、初期反映は layout.tsx のインラインスクリプトで行う)
export default function PaletteToggle() {
  const [mono, setMono] = useState(false)

  useEffect(() => {
    setMono(document.documentElement.dataset.palette === "mono")
  }, [])

  const toggle = () => {
    const next = !mono
    setMono(next)
    if (next) {
      document.documentElement.dataset.palette = "mono"
    } else {
      delete document.documentElement.dataset.palette
    }
    try {
      localStorage.setItem(STORAGE_KEY, next ? "mono" : "lime")
    } catch {
      // 保存できなくても、そのページでは切り替わる
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={toggle}
    >
      <Contrast size={14} />
      配色: {mono ? "白黒" : "ライム"}
    </Button>
  )
}
