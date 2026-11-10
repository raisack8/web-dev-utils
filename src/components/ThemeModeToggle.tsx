"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

// 黒背景(既定)と白背景を切り替える。選択はnext-themesが端末ごとに記憶する
export default function ThemeModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  // SSRとの表示ずれを避けるため、マウント後にだけ現在のモードを出す
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const light = mounted && resolvedTheme === "light"

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={() => setTheme(light ? "dark" : "light")}
    >
      {light ? <Sun size={14} /> : <Moon size={14} />}
      背景: {light ? "白" : "黒"}
    </Button>
  )
}
