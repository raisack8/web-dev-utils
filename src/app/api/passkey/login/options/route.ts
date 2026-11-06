import { NextResponse } from "next/server"
import { generateAuthenticationOptions } from "@simplewebauthn/server"
import { getRpConfig } from "@/lib/passkey"
import {
  CHALLENGE_COOKIE,
  challengeCookieOptions,
  createChallengeToken,
} from "@/lib/session"

export async function POST() {
  const { rpID } = getRpConfig()
  // allowCredentials を空にすると、ブラウザがパスキーの選択肢(スマホのQR含む)を出す
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: "required",
  })

  const response = NextResponse.json(options)
  response.cookies.set(
    CHALLENGE_COOKIE,
    await createChallengeToken("login", options.challenge),
    challengeCookieOptions
  )
  return response
}
