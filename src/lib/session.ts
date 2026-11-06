import { jwtVerify, SignJWT } from "jose"

export const SESSION_COOKIE = "session"
export const CHALLENGE_COOKIE = "pk_challenge"

const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30日
const CHALLENGE_MAX_AGE = 60 * 5 // 5分

function getKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET は32文字以上で設定してください")
  }
  return new TextEncoder().encode(secret)
}

async function sign(
  payload: Record<string, string>,
  maxAgeSec: number
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(getKey())
}

async function verify(token: string | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    })
    return payload
  } catch {
    return null
  }
}

export const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
})

export const sessionCookieOptions = cookieOptions(SESSION_MAX_AGE)
export const challengeCookieOptions = cookieOptions(CHALLENGE_MAX_AGE)

export const createSessionToken = () => sign({ sub: "owner" }, SESSION_MAX_AGE)

export async function isValidSession(token: string | undefined) {
  return (await verify(token))?.sub === "owner"
}

/** パスキーのチャレンジを署名付きCookieに預ける(用途ごとに purpose で分離) */
export const createChallengeToken = (
  purpose: "register" | "login",
  challenge: string
) => sign({ purpose, challenge }, CHALLENGE_MAX_AGE)

export async function readChallenge(
  token: string | undefined,
  purpose: "register" | "login"
) {
  const payload = await verify(token)
  if (payload?.purpose !== purpose) return null
  return typeof payload.challenge === "string" ? payload.challenge : null
}
