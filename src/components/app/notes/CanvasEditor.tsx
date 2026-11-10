"use client"

import { useEffect, useRef, useState } from "react"
import { Excalidraw } from "@excalidraw/excalidraw"
import { useTheme } from "next-themes"
import "@excalidraw/excalidraw/index.css"
import { saveNoteContent } from "@/lib/action/notes"

const SAVE_DELAY_MS = 1000

type Status = "saved" | "saving" | "error"
type Elements = Parameters<
  NonNullable<React.ComponentProps<typeof Excalidraw>["onChange"]>
>[0]

// 保存するのは図形データと背景色のみ。画像ファイルはRedisに載せないため扱わない
type SavedScene = { elements: Elements; viewBackgroundColor?: string }

function parseScene(content: string): SavedScene {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed.elements)) return parsed
  } catch {
    // 空のノート(新規作成直後)など
  }
  return { elements: [] }
}

// 親側で key={noteId} を付けて、ノートごとに作り直す前提
export default function CanvasEditor({
  noteId,
  initialContent,
}: {
  noteId: string
  initialContent: string
}) {
  const { resolvedTheme } = useTheme()
  const [status, setStatus] = useState<Status>("saved")
  const [initial] = useState(() => parseScene(initialContent))
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latest = useRef<SavedScene | null>(null)
  const lastSaved = useRef(JSON.stringify(initial))

  const flush = async () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    const scene = latest.current
    if (!scene) return
    const serialized = JSON.stringify(scene)
    // マウス移動などでonChangeが呼ばれても、内容が同じなら保存しない
    if (serialized === lastSaved.current) {
      latest.current = null
      setStatus("saved")
      return
    }
    try {
      await saveNoteContent(noteId, serialized)
      lastSaved.current = serialized
      if (latest.current === scene) latest.current = null
      setStatus(latest.current === null ? "saved" : "saving")
    } catch (error) {
      console.error("Save canvas error:", error)
      setStatus("error")
    }
  }

  // ノート切替・画面遷移時は、未保存分をすぐ保存する
  useEffect(() => {
    return () => {
      void flush()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="pb-2 text-right text-xs text-muted-foreground">
        {status === "saved" && "保存済み"}
        {status === "saving" && "保存中..."}
        {status === "error" && "保存に失敗しました"}
      </div>
      <div className="flex-1 min-h-0">
        <Excalidraw
          theme={resolvedTheme === "light" ? "light" : "dark"}
          langCode="ja-JP"
          initialData={{
            elements: initial.elements,
            appState: { viewBackgroundColor: initial.viewBackgroundColor },
            scrollToContent: true,
          }}
          UIOptions={{ tools: { image: false } }}
          onChange={(elements, appState) => {
            latest.current = {
              elements: elements.filter((e) => !e.isDeleted) as Elements,
              viewBackgroundColor: appState.viewBackgroundColor,
            }
            if (timer.current) clearTimeout(timer.current)
            timer.current = setTimeout(flush, SAVE_DELAY_MS)
            if (JSON.stringify(latest.current) !== lastSaved.current) {
              setStatus("saving")
            }
          }}
        />
      </div>
    </div>
  )
}
