"use client"

import { useEffect, useRef, useState } from "react"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table"
import { Markdown } from "@tiptap/markdown"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@/components/ui/button"
import { saveNoteContent } from "@/lib/action/notes"

const SAVE_DELAY_MS = 800

// マークダウンの表(ヘッダ行+区切り行`| --- |`)かどうか
const isMarkdownTable = (text: string) =>
  /^\s*\|.*\|\s*\n\s*\|[\s:|-]*-[\s:|-]*\|/.test(text)

type Status = "saved" | "saving" | "error"

// 親側で key={noteId} を付けて、ノートごとに作り直す前提
export default function NoteEditor({
  noteId,
  initialContent,
}: {
  noteId: string
  initialContent: string
}) {
  const [status, setStatus] = useState<Status>("saved")
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef<string | null>(null)
  const editorRef = useRef<Editor | null>(null)

  const flush = async () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    const markdown = pending.current
    if (markdown === null) return
    pending.current = null
    try {
      await saveNoteContent(noteId, markdown)
      setStatus(pending.current === null ? "saved" : "saving")
    } catch (error) {
      console.error("Save note error:", error)
      pending.current = markdown
      setStatus("error")
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    // 表の中にいるときだけ行・列ボタンを出すため、選択変更でも再描画する
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Markdown,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "ここに書く（# で見出し、- でリスト）",
      }),
    ],
    content: initialContent,
    contentType: "markdown",
    onCreate: ({ editor }) => {
      editorRef.current = editor
    },
    editorProps: {
      attributes: { class: "note-editor" },
      // マークダウンの表をペーストしたら、表として挿入する
      handlePaste: (_view, event) => {
        const text = event.clipboardData?.getData("text/plain") ?? ""
        if (!editorRef.current || !isMarkdownTable(text)) return false
        editorRef.current.commands.insertContent(text, {
          contentType: "markdown",
        })
        return true
      },
    },
    onUpdate: ({ editor }) => {
      pending.current = editor.getMarkdown()
      setStatus("saving")
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(flush, SAVE_DELAY_MS)
    },
  })

  // ノート切替・画面遷移時は、未保存分をすぐ保存する
  useEffect(() => {
    return () => {
      void flush()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tools = editor
    ? ([
        ["H1", () => editor.chain().focus().toggleHeading({ level: 1 }).run()],
        ["H2", () => editor.chain().focus().toggleHeading({ level: 2 }).run()],
        ["B", () => editor.chain().focus().toggleBold().run()],
        ["•", () => editor.chain().focus().toggleBulletList().run()],
        ["1.", () => editor.chain().focus().toggleOrderedList().run()],
        ["“", () => editor.chain().focus().toggleBlockquote().run()],
        ["</>", () => editor.chain().focus().toggleCodeBlock().run()],
        ["`", () => editor.chain().focus().toggleCode().run()],
        [
          "表",
          () =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run(),
        ],
        // 表の中にカーソルがあるときだけ、行・列・表の操作を出す
        ...(editor.isActive("table")
          ? ([
              ["+行", () => editor.chain().focus().addRowAfter().run()],
              ["-行", () => editor.chain().focus().deleteRow().run()],
              ["+列", () => editor.chain().focus().addColumnAfter().run()],
              ["-列", () => editor.chain().focus().deleteColumn().run()],
              ["表削除", () => editor.chain().focus().deleteTable().run()],
            ] as const)
          : []),
      ] as const)
    : []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 pb-2 border-b">
        {tools.map(([label, run]) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onMouseDown={(e) => e.preventDefault()}
            onClick={run}
          >
            {label}
          </Button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {status === "saved" && "保存済み"}
          {status === "saving" && "保存中..."}
          {status === "error" && "保存に失敗しました"}
        </span>
      </div>
      <EditorContent editor={editor} className="flex-1 overflow-auto pt-4" />
    </div>
  )
}
