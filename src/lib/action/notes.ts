"use server"

import { ensureConnection, redis, withNamespace } from "@/lib/redis/client"

export interface NoteNode {
  id: string
  parentId: string | null // null はルート
  type: "folder" | "note"
  // ノートの種類。未設定(既存データ)は md として扱う
  format?: "md" | "canvas"
  name: string
  updatedAt: string
}

const NODES_KEY = withNamespace("notes:nodes")
const contentKey = (id: string) => withNamespace(`notes:content:${id}`)

async function readNodes(): Promise<NoteNode[]> {
  await ensureConnection()
  const all = await redis.hGetAll(NODES_KEY)
  return Object.values(all).map((v) => JSON.parse(v) as NoteNode)
}

/** フォルダ・ノートをすべて取得する(階層の組み立てはクライアントで行う) */
export async function getNoteNodes() {
  return readNodes()
}

export async function createNoteNode(
  parentId: string | null,
  type: NoteNode["type"],
  name: string,
  format: NonNullable<NoteNode["format"]> = "md"
) {
  const trimmed = name.trim()
  if (!trimmed) throw new Error("名前を入力してください")

  const nodes = await readNodes()
  if (
    parentId &&
    !nodes.some((n) => n.id === parentId && n.type === "folder")
  ) {
    throw new Error("親フォルダが見つかりません")
  }

  const node: NoteNode = {
    id: crypto.randomUUID(),
    parentId,
    type,
    ...(type === "note" ? { format } : {}),
    name: trimmed,
    updatedAt: new Date().toISOString(),
  }
  await redis.hSet(NODES_KEY, node.id, JSON.stringify(node))
  return node
}

/** フォルダは配下をすべて削除する */
export async function deleteNoteNode(id: string) {
  const nodes = await readNodes()
  const targets = new Set([id])
  let added = true
  while (added) {
    added = false
    for (const n of nodes) {
      if (n.parentId && targets.has(n.parentId) && !targets.has(n.id)) {
        targets.add(n.id)
        added = true
      }
    }
  }
  const ids = [...targets]
  await redis.hDel(NODES_KEY, ids)
  await redis.del(ids.map(contentKey))
  return ids
}

export async function getNoteContent(id: string) {
  await ensureConnection()
  return (await redis.get(contentKey(id))) ?? ""
}

export async function saveNoteContent(id: string, markdown: string) {
  await ensureConnection()
  const raw = await redis.hGet(NODES_KEY, id)
  if (!raw) throw new Error("ノートが見つかりません")

  const node = JSON.parse(raw) as NoteNode
  if (node.type !== "note") throw new Error("ノートではありません")

  // TTLなし(期限なし)で保存する
  await redis.set(contentKey(id), markdown)
  await redis.hSet(
    NODES_KEY,
    id,
    JSON.stringify({ ...node, updatedAt: new Date().toISOString() })
  )
}
