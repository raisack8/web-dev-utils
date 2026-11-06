"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import {
  ChevronLeft,
  ChevronRight,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  Shapes,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createNoteNode,
  deleteNoteNode,
  getNoteContent,
  getNoteNodes,
  type NoteNode,
} from "@/lib/action/notes"

// エディタ(TipTap / Excalidraw)はノートを開いたときだけ読み込む
const NoteEditor = dynamic(() => import("./NoteEditor"), { ssr: false })
const CanvasEditor = dynamic(() => import("./CanvasEditor"), { ssr: false })

const WIDTH_KEY = "notes:explorerWidth"
const MIN_WIDTH = 160
const MAX_WIDTH = 600
const DEFAULT_WIDTH = 288

type OpenNote = { id: string; content: string }
type Creating = { type: NoteNode["type"]; format?: NoteNode["format"] }

export default function NotesExplorer() {
  const [nodes, setNodes] = useState<NoteNode[]>([])
  const [loaded, setLoaded] = useState(false)
  const [folderId, setFolderId] = useState<string | null>(null)
  const [open, setOpen] = useState<OpenNote | null>(null)
  const [creating, setCreating] = useState<Creating | null>(null)
  const [name, setName] = useState("")
  // 左右の枠の境界をドラッグで動かす。幅は端末ごとに記憶する
  const [width, setWidth] = useState(DEFAULT_WIDTH)
  const [collapsed, setCollapsed] = useState(false)
  const explorerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(WIDTH_KEY))
      if (saved >= MIN_WIDTH && saved <= MAX_WIDTH) setWidth(saved)
    } catch {
      // localStorageが使えない環境では既定幅のまま
    }
  }, [])

  const saveWidth = (w: number) => {
    try {
      localStorage.setItem(WIDTH_KEY, String(w))
    } catch {
      // 保存できなくても動作に影響しない
    }
  }

  const handleResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
    const left = explorerRef.current?.getBoundingClientRect().left ?? 0
    setWidth(Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - left)))
  }

  useEffect(() => {
    getNoteNodes()
      .then(setNodes)
      .catch(() => toast.error("ノートの読み込みに失敗しました"))
      .finally(() => setLoaded(true))
  }, [])

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes])

  // ルートから現在のフォルダまでのパス(パンくず)
  const path = useMemo(() => {
    const result: NoteNode[] = []
    let cur = folderId ? byId.get(folderId) : undefined
    while (cur) {
      result.unshift(cur)
      cur = cur.parentId ? byId.get(cur.parentId) : undefined
    }
    return result
  }, [byId, folderId])

  const children = useMemo(
    () =>
      nodes
        .filter((n) => n.parentId === folderId)
        .sort(
          (a, b) =>
            (a.type === b.type ? 0 : a.type === "folder" ? -1 : 1) ||
            a.name.localeCompare(b.name, "ja")
        ),
    [nodes, folderId]
  )

  const openNote = async (id: string) => {
    try {
      setOpen({ id, content: await getNoteContent(id) })
    } catch {
      toast.error("ノートを開けませんでした")
    }
  }

  const handleCreate = async () => {
    if (!creating) return
    try {
      const node = await createNoteNode(
        folderId,
        creating.type,
        name,
        creating.format
      )
      setNodes((prev) => [...prev, node])
      setCreating(null)
      setName("")
      if (node.type === "note") setOpen({ id: node.id, content: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "作成に失敗しました")
    }
  }

  const handleDelete = async (node: NoteNode) => {
    const what = node.type === "folder" ? "フォルダ（中身ごと）" : "ノート"
    if (!window.confirm(`${what}「${node.name}」を削除しますか？`)) return
    try {
      const removed = new Set(await deleteNoteNode(node.id))
      setNodes((prev) => prev.filter((n) => !removed.has(n.id)))
      if (open && removed.has(open.id)) setOpen(null)
    } catch {
      toast.error("削除に失敗しました")
    }
  }

  const openNode = open ? byId.get(open.id) : undefined
  const Editor = openNode?.format === "canvas" ? CanvasEditor : NoteEditor

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:h-[calc(100vh-4rem)]">
      {/* エクスプローラー */}
      <div
        ref={explorerRef}
        style={{ "--explorer-width": `${width}px` } as React.CSSProperties}
        className={`border p-3 space-y-3 overflow-auto md:shrink-0 md:w-[var(--explorer-width)] ${
          collapsed ? "md:hidden" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-1 text-sm">
          <button
            type="button"
            className="hover:text-primary"
            onClick={() => setFolderId(null)}
          >
            ノート
          </button>
          {path.map((p) => (
            <span key={p.id} className="flex items-center gap-1">
              <ChevronRight size={12} className="text-muted-foreground" />
              <button
                type="button"
                className="hover:text-primary"
                onClick={() => setFolderId(p.id)}
              >
                {p.name}
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            title="フォルダ"
            onClick={() => setCreating({ type: "folder" })}
          >
            <FolderPlus size={14} /> フォルダ
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="マークダウンのノート"
            onClick={() => setCreating({ type: "note", format: "md" })}
          >
            <FilePlus size={14} /> MD
          </Button>
          <Button
            size="sm"
            variant="outline"
            title="ホワイトボード(キャンバス)"
            onClick={() => setCreating({ type: "note", format: "canvas" })}
          >
            <Shapes size={14} /> キャンバス
          </Button>
        </div>

        {creating && (
          <form className="flex gap-1" action={handleCreate}>
            <Input
              autoFocus
              value={name}
              placeholder={
                creating.type === "folder" ? "フォルダ名" : "ノート名"
              }
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setCreating(null)}
            />
            <Button type="submit" size="sm">
              作成
            </Button>
          </form>
        )}

        <ul className="space-y-0.5">
          {loaded && children.length === 0 && (
            <li className="text-xs text-muted-foreground">空です</li>
          )}
          {children.map((node) => (
            <li
              key={node.id}
              className={`group flex items-center gap-1 pr-1 ${
                open?.id === node.id ? "bg-secondary" : ""
              }`}
            >
              <button
                type="button"
                className="flex flex-1 items-center gap-2 px-2 py-1.5 text-left text-sm hover:text-primary min-w-0"
                onClick={() =>
                  node.type === "folder"
                    ? setFolderId(node.id)
                    : openNote(node.id)
                }
              >
                {node.type === "folder" ? (
                  <Folder size={14} className="shrink-0 text-primary" />
                ) : node.format === "canvas" ? (
                  <Shapes size={14} className="shrink-0" />
                ) : (
                  <FileText size={14} className="shrink-0" />
                )}
                <span className="truncate">{node.name}</span>
              </button>
              <button
                type="button"
                aria-label="削除"
                className="p-1 text-muted-foreground hover:text-destructive md:opacity-0 group-hover:opacity-100"
                onClick={() => handleDelete(node)}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 境界(ドラッグで幅を変更、ボタンで開閉) */}
      <div className="hidden md:flex w-3 shrink-0 flex-col items-center group/handle">
        <button
          type="button"
          aria-label={collapsed ? "一覧を開く" : "一覧を閉じる"}
          className="mt-1 text-muted-foreground hover:text-primary"
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
        {!collapsed && (
          <div
            className="flex-1 w-1.5 cursor-col-resize touch-none hover:bg-primary/50"
            onPointerDown={(e) =>
              e.currentTarget.setPointerCapture(e.pointerId)
            }
            onPointerMove={handleResize}
            onPointerUp={() => saveWidth(width)}
          />
        )}
      </div>

      {/* エディタ */}
      <div className="flex-1 min-w-0 border p-4 min-h-[60vh] md:min-h-0 overflow-hidden">
        {open ? (
          <div className="flex flex-col h-full">
            <h2 className="text-lg font-medium mb-2 truncate">
              {openNode?.name}
            </h2>
            <div
              className={`flex-1 min-h-0 ${
                openNode?.format === "canvas" ? "h-[70vh] md:h-auto" : ""
              }`}
            >
              <Editor
                key={open.id}
                noteId={open.id}
                initialContent={open.content}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            ノートを選択するか、新しく作成してください。
          </p>
        )}
      </div>
    </div>
  )
}
