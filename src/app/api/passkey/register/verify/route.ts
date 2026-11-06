import { NextResponse } from "next/server"
import { verifyRegistrationResponse } from "@simplewebauthn/server"
import { isoBase64URL } from "@simplewebauthn/server/helpers"
import {
  getRpConfig,
  isValidSetupToken,
  saveCredential,
  type StoredCredential,
} from "@/lib/passkey"
import { CHALLENGE_COOKIE, readChallenge } from "@/lib/session"

export async function POST(request: Request) {
  const { setupToken, response } = await request.json().catch(() => ({}))
  if (!isValidSetupToken(setupToken)) {
    return NextResponse.json(
      { error: "登録用トークンが違います" },
      { status: 403 }
    )
  }

  const cookie = request.headers
    .get("cookie")
    ?.match(new RegExp(`${CHALLENGE_COOKIE}=([^;]+)`))?.[1]
  const expectedChallenge = await readChallenge(cookie, "register")
  if (!expectedChallenge) {
    return NextResponse.json({ error: "有効期限切れです" }, { status: 400 })
  }

  const { rpID, origin } = getRpConfig()
  try {
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    })
    if (!verification.verified) {
      return NextResponse.json({ error: "登録に失敗しました" }, { status: 400 })
    }

    const { credential } = verification.registrationInfo
    await saveCredential({
      id: credential.id,
      publicKey: isoBase64URL.fromBuffer(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports as StoredCredential["transports"],
    })
  } catch (error) {
    console.error("Passkey registration error:", error)
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 400 })
  }

  const res = NextResponse.json({ verified: true })
  res.cookies.delete(CHALLENGE_COOKIE)
  return res
}
