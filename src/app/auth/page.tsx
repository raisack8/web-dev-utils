"use client"

import { useState } from "react"
import { startAuthentication, startRegistration } from "@simplewebauthn/browser"
import { KeyRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
  const [showSetup, setShowSetup] = useState(false)
  const [setupToken, setSetupToken] = useState("")

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      const optionsJSON = await post("/api/passkey/login/options")
      // PCではブラウザがQRコードを表示し、スマホの生体認証で承認できる
      const response = await startAuthentication({ optionsJSON })
      await post("/api/passkey/login/verify", { response })
      window.location.href = "/"
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "認証に失敗しました")
      setIsLoading(false)
    }
  }

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
      setSetupToken("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "登録に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">ログイン</h1>
          <p className="text-sm text-muted-foreground">
            パスキーで認証します。PCではQRコードをスマホで読み取ってください。
          </p>
        </div>

        <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
          <KeyRound className="w-5 h-5 mr-2" />
          パスキーでログイン
        </Button>

        <div className="pt-4 border-t space-y-3">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:underline w-full text-center"
            onClick={() => setShowSetup((v) => !v)}
          >
            この端末・スマホを登録する
          </button>
          {showSetup && (
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="登録用トークン"
                value={setupToken}
                onChange={(e) => setSetupToken(e.target.value)}
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegister}
                disabled={isLoading || !setupToken}
              >
                パスキーを登録
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
