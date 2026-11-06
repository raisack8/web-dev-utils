import { timingSafeEqual } from "node:crypto"
import type { AuthenticatorTransport } from "@simplewebauthn/server"
import { ensureConnection, redis, withNamespace } from "@/lib/redis/client"

const CREDENTIALS_KEY = withNamespace("passkey:credentials")

export const RP_NAME = "Web Dev Utils"
// 1人用なのでユーザーは固定
export const USER_NAME = "owner"
export const USER_ID = new TextEncoder().encode("owner")

export function getRpConfig() {
  const rpID = process.env.WEBAUTHN_RP_ID
  const origin = process.env.WEBAUTHN_ORIGIN
  if (!rpID || !origin) {
    throw new Error("WEBAUTHN_RP_ID と WEBAUTHN_ORIGIN を設定してください")
  }
  return { rpID, origin }
}

/** 初回登録用の合言葉(SETUP_TOKEN)を定数時間で比較する */
export function isValidSetupToken(input: unknown) {
  const expected = process.env.SETUP_TOKEN
  if (!expected || typeof input !== "string") return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export type StoredCredential = {
  id: string
  publicKey: string // base64url
  counter: number
  transports?: AuthenticatorTransport[]
}

export async function listCredentials(): Promise<StoredCredential[]> {
  await ensureConnection()
  const all = await redis.hGetAll(CREDENTIALS_KEY)
  return Object.values(all).map((v) => JSON.parse(v) as StoredCredential)
}

export async function getCredential(
  id: string
): Promise<StoredCredential | null> {
  await ensureConnection()
  const v = await redis.hGet(CREDENTIALS_KEY, id)
  return v ? (JSON.parse(v) as StoredCredential) : null
}

export async function saveCredential(credential: StoredCredential) {
  await ensureConnection()
  await redis.hSet(CREDENTIALS_KEY, credential.id, JSON.stringify(credential))
}
