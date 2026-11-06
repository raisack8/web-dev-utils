import { NextResponse } from "next/server"
import { generateRegistrationOptions } from "@simplewebauthn/server"
import {
  getRpConfig,
  isValidSetupToken,
  listCredentials,
  RP_NAME,
  USER_ID,
  USER_NAME,
} from "@/lib/passkey"
import {
  CHALLENGE_COOKIE,
  challengeCookieOptions,
  createChallengeToken,
} from "@/lib/session"

export async function POST(request: Request) {
  const { setupToken } = await request.json().catch(() => ({}))
  if (!isValidSetupToken(setupToken)) {
    return NextResponse.json(
      { error: "登録用トークンが違います" },
      { status: 403 }
    )
  }

  const { rpID } = getRpConfig()
  const existing = await listCredentials()
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userName: USER_NAME,
    userID: USER_ID,
    // 登録済みの端末を二重登録しない
    excludeCredentials: existing.map((c) => ({
      id: c.id,
      transports: c.transports,
    })),
    // スマホ(QR経由)でも使えるよう、端末内のパスキー(discoverable)＋生体認証を必須にする
    authenticatorSelection: {
      residentKey: "required",
      userVerification: "required",
    },
  })

  const response = NextResponse.json(options)
  response.cookies.set(
    CHALLENGE_COOKIE,
    await createChallengeToken("register", options.challenge),
    challengeCookieOptions
  )
  return response
}
