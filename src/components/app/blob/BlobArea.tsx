"use client"

import { useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { Download, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { deleteFile, type BlobFile } from "@/lib/action/blob"

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("ja-JP")
}

export default function BlobArea({ files = [] }: { files?: BlobFile[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [isUploading, startUpload] = useTransition()

  // Server Actionはボディ上限(Vercelで4.5MB)があるため、ブラウザから直接アップロードする
  const handleUpload = (formData: FormData) => {
    const file = formData.get("file")
    if (!(file instanceof File) || file.size === 0) {
      toast.error("ファイルを選択してください")
      return
    }
    startUpload(async () => {
      try {
        await upload(file.name, file, {
          access: "private",
          handleUploadUrl: "/api/blob/upload",
          multipart: true,
        })
        toast.success("アップロードしました")
        formRef.current?.reset()
        router.refresh()
      } catch (error) {
        console.error("Blob upload error:", error)
        toast.error("アップロードに失敗しました")
      }
    })
  }

  const handleDelete = async (pathname: string) => {
    const result = await deleteFile(pathname)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  const fileUrl = (pathname: string, download: boolean) =>
    `/api/blob?pathname=${encodeURIComponent(pathname)}${download ? "&download=1" : ""}`

  return (
    <div className="w-full space-y-4">
      <Card className="w-full px-8 py-4 m-1">
        <form
          ref={formRef}
          action={handleUpload}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <h2 className="text-lg font-medium sm:mr-2">ファイル保存</h2>
          <Input type="file" name="file" required className="flex-1" />
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "アップロード中..." : "アップロード"}
          </Button>
        </form>
      </Card>
      <div className="w-full ml-1 grid md:grid-cols-2 gap-2">
        {files.map((file) => (
          <Card key={file.pathname} className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <a
                  href={fileUrl(file.pathname, false)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {file.pathname}
                </a>
                <div className="text-xs text-muted-foreground">
                  {formatSize(file.size)} ・ {formatDate(file.uploadedAt)}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <a
                    href={fileUrl(file.pathname, true)}
                    title="ダウンロード"
                  >
                    <Download size={14} />
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  title="削除"
                  onClick={() => handleDelete(file.pathname)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {files.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          保存されたファイルはありません
        </div>
      )}
    </div>
  )
}
