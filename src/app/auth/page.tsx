"use client"

import { useCallback, useEffect, useState } from "react"
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

async function post(url: string, body?: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? "エラーが発生しました")
  return data
}

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  // 登録用の入力欄は、URLに #setup を付けたときだけ出す(通常は何も表示しない)
  const [showSetup, setShowSetup] = useState(false)
  const [setupToken, setSetupToken] = useState("")

  const handleLogin = useCallback(async (silent = false) => {
    setIsLoading(true)
    try {
      const optionsJSON = await post("/api/passkey/login/options")
      // PCではブラウザがQRコードを表示し、スマホの生体認証で承認できる
      const response = await startAuthentication({ optionsJSON })
      await post("/api/passkey/login/verify", { response })
      window.location.href = "/"
    } catch (error) {
      // 自動起動時やキャンセル時はエラーを出さず、ボタンだけ残す
      if (!silent) {
        toast.error(
          error instanceof Error ? error.message : "認証に失敗しました"
        )
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (window.location.hash === "#setup") {
      setShowSetup(true)
      return
    }
    handleLogin(true)
  }, [handleLogin])

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      const optionsJSON = await post("/api/passkey/register/options", {
        setupToken,
      })
      const response = await startRegistration({ optionsJSON })
      await post("/api/passkey/register/verify", { setupToken, response })
      toast.success("パスキーを登録しました")
      setShowSetup(false)
      window.location.hash = ""
      setSetupToken("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登録に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        className="size-14 rounded-full"
        onClick={() => handleLogin()}
        disabled={isLoading}
        aria-label="パスキー"
      >
        <KeyRound className="size-7" />
      </Button>

      {showSetup && (
        <div className="w-64 space-y-3">
          <Input
            type="password"
            placeholder="setup token"
            value={setupToken}
            onChange={(e) => setSetupToken(e.target.value)}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRegister}
            disabled={isLoading || !setupToken}
          >
            register
          </Button>
        </div>
      )}
    </div>
  )
}
