import { NextResponse } from "next/server"
import { verifyAuthenticationResponse } from "@simplewebauthn/server"
import { isoBase64URL } from "@simplewebauthn/server/helpers"
import { getCredential, getRpConfig, saveCredential } from "@/lib/passkey"
import {
  CHALLENGE_COOKIE,
  createSessionToken,
  readChallenge,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/session"

const fail = () =>
  NextResponse.json({ error: "認証に失敗しました" }, { status: 401 })

export async function POST(request: Request) {
  const { response } = await request.json().catch(() => ({}))

  const cookie = request.headers
    .get("cookie")
    ?.match(new RegExp(`${CHALLENGE_COOKIE}=([^;]+)`))?.[1]
  const expectedChallenge = await readChallenge(cookie, "login")
  const stored =
    typeof response?.id === "string" ? await getCredential(response.id) : null
  if (!expectedChallenge || !stored) return fail()

  const { rpID, origin } = getRpConfig()
  try {
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
      credential: {
        id: stored.id,
        publicKey: isoBase64URL.toBuffer(stored.publicKey),
        counter: stored.counter,
        transports: stored.transports,
      },
    })
    if (!verification.verified) return fail()

    await saveCredential({
      ...stored,
      counter: verification.authenticationInfo.newCounter,
    })
  } catch (error) {
    console.error("Passkey login error:", error)
    return fail()
  }

  const res = NextResponse.json({ verified: true })
  res.cookies.delete(CHALLENGE_COOKIE)
  res.cookies.set(
    SESSION_COOKIE,
    await createSessionToken(),
    sessionCookieOptions
  )
  return res
}
