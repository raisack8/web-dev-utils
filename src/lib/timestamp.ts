export type Tz = "local" | "utc"
export type ShiftUnit = "day" | "month"

const pad = (n: number, len = 2) => String(n).padStart(len, "0")
const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"]

/** 指定タイムゾーンでの年月日時分秒・曜日 */
export function getParts(date: Date, tz: Tz) {
  const utc = tz === "utc"
  return {
    y: utc ? date.getUTCFullYear() : date.getFullYear(),
    m: (utc ? date.getUTCMonth() : date.getMonth()) + 1,
    d: utc ? date.getUTCDate() : date.getDate(),
    h: utc ? date.getUTCHours() : date.getHours(),
    mi: utc ? date.getUTCMinutes() : date.getMinutes(),
    s: utc ? date.getUTCSeconds() : date.getSeconds(),
    w: utc ? date.getUTCDay() : date.getDay(),
  }
}

/** `<input type="datetime-local">` 用の文字列(YYYY-MM-DDTHH:mm:ss) */
export function toDatetimeLocal(date: Date, tz: Tz) {
  const p = getParts(date, tz)
  return `${pad(p.y, 4)}-${pad(p.m)}-${pad(p.d)}T${pad(p.h)}:${pad(p.mi)}:${pad(p.s)}`
}

/** `YYYY/MM/DD HH:mm:ss (曜)` */
export function formatDate(date: Date, tz: Tz) {
  const p = getParts(date, tz)
  return `${pad(p.y, 4)}/${pad(p.m)}/${pad(p.d)} ${pad(p.h)}:${pad(p.mi)}:${pad(p.s)} (${WEEKDAYS[p.w]})`
}

/** datetime-local の文字列を、指定タイムゾーンの日時として解釈する */
export function parseDatetimeLocal(text: string, tz: Tz): Date | null {
  const m = text.match(
    /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  )
  if (!m) return null
  const [y, mo, d, h, mi, s] = m.slice(1).map((v) => Number(v ?? 0))
  const date =
    tz === "utc"
      ? new Date(Date.UTC(y, mo - 1, d, h, mi, s))
      : new Date(y, mo - 1, d, h, mi, s)
  // 年が0〜99のとき Date が 1900年代として扱うため、設定し直す
  if (y < 100) {
    if (tz === "utc") date.setUTCFullYear(y)
    else date.setFullYear(y)
  }
  return Number.isNaN(date.getTime()) ? null : date
}

/** 日・月を暦どおりに加減算する。月は末日を超えないよう丸める(1/31 +1か月 → 2/28) */
export function shiftDate(
  date: Date,
  unit: ShiftUnit,
  amount: number,
  tz: Tz
): Date {
  const next = new Date(date.getTime())
  const utc = tz === "utc"
  if (unit === "day") {
    if (utc) next.setUTCDate(next.getUTCDate() + amount)
    else next.setDate(next.getDate() + amount)
    return next
  }

  const day = utc ? next.getUTCDate() : next.getDate()
  // 一旦1日にしてから月を動かし、元の日と月末の小さい方を採用する
  if (utc) next.setUTCDate(1)
  else next.setDate(1)
  if (utc) next.setUTCMonth(next.getUTCMonth() + amount)
  else next.setMonth(next.getMonth() + amount)
  const lastDay = utc
    ? new Date(
        Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)
      ).getUTCDate()
    : new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  if (utc) next.setUTCDate(Math.min(day, lastDay))
  else next.setDate(Math.min(day, lastDay))
  return next
}

export type TsUnit = "auto" | "s" | "ms"

/** タイムスタンプ文字列をDateにする。autoは桁数(絶対値が1e11以上ならミリ秒)で判定 */
export function parseTimestamp(
  text: string,
  unit: TsUnit
): { date: Date; unit: "s" | "ms" } | null {
  const t = text.trim()
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null
  const n = Number(t)
  const resolved = unit === "auto" ? (Math.abs(n) >= 1e11 ? "ms" : "s") : unit
  const date = new Date(resolved === "s" ? n * 1000 : n)
  return Number.isNaN(date.getTime()) ? null : { date, unit: resolved }
}
