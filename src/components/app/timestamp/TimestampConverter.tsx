"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  formatDate,
  parseDatetimeLocal,
  parseTimestamp,
  shiftDate,
  toDatetimeLocal,
  type ShiftUnit,
  type TsUnit,
  type Tz,
} from "@/lib/timestamp"
import CopyRow from "./CopyRow"

const SHIFTS: { label: string; unit: ShiftUnit; amount: number }[] = [
  { label: "-1か月", unit: "month", amount: -1 },
  { label: "-7日", unit: "day", amount: -7 },
  { label: "-1日", unit: "day", amount: -1 },
  { label: "+1日", unit: "day", amount: 1 },
  { label: "+7日", unit: "day", amount: 7 },
  { label: "+1か月", unit: "month", amount: 1 },
]

// 日時 ⇄ タイムスタンプの相互変換。基準は「date」1つで、どちらの入力欄を編集しても同期する
export default function TimestampConverter() {
  const [date, setDate] = useState<Date | null>(null)
  const [tz, setTz] = useState<Tz>("local")
  const [unit, setUnit] = useState<TsUnit>("auto")
  const [dateText, setDateText] = useState("")
  const [tsText, setTsText] = useState("")
  const [localZone, setLocalZone] = useState("")

  // 入力欄の表示を date から作り直す(編集中の側は除く)
  const sync = (
    d: Date,
    nextTz: Tz = tz,
    nextUnit: TsUnit = unit,
    skip?: "date" | "ts"
  ) => {
    setDate(d)
    if (skip !== "date") setDateText(toDatetimeLocal(d, nextTz))
    if (skip !== "ts") {
      const ms = d.getTime()
      // 自動判定のときは、いま入力欄に入っている桁(秒/ミリ秒)を保つ
      const resolved =
        nextUnit === "auto"
          ? (parseTimestamp(tsText, "auto")?.unit ?? "s")
          : nextUnit
      setTsText(resolved === "ms" ? String(ms) : String(Math.floor(ms / 1000)))
    }
  }

  useEffect(() => {
    setLocalZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
    sync(new Date())
    // 初回のみ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateText = (text: string) => {
    setDateText(text)
    const d = parseDatetimeLocal(text, tz)
    if (d) sync(d, tz, unit, "date")
  }

  const handleTsText = (text: string) => {
    setTsText(text)
    const parsed = parseTimestamp(text, unit)
    if (parsed) sync(parsed.date, tz, unit, "ts")
  }

  const handleTz = (next: Tz) => {
    setTz(next)
    if (date) sync(date, next, unit)
  }

  const handleUnit = (next: TsUnit) => {
    setUnit(next)
    if (date) sync(date, tz, next)
  }

  const handleShift = (s: (typeof SHIFTS)[number]) => {
    if (!date) return
    sync(shiftDate(date, s.unit, s.amount, tz))
  }

  const parsedTs = parseTimestamp(tsText, unit)
  const dateInvalid = dateText !== "" && !parseDatetimeLocal(dateText, tz)
  const tsInvalid = tsText !== "" && !parsedTs

  return (
    <Card className="w-full px-8 py-4 m-1 space-y-4">
      <h2 className="text-lg font-medium">日時 ⇄ タイムスタンプ</h2>

      <div className="space-y-1">
        <Label>タイムゾーン</Label>
        <RadioGroup
          value={tz}
          onValueChange={(v) => handleTz(v as Tz)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="tz-local" />
            <Label htmlFor="tz-local">
              ローカル{localZone && `（${localZone}）`}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="utc" id="tz-utc" />
            <Label htmlFor="tz-utc">UTC</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="ts-date">日時</Label>
          <Input
            id="ts-date"
            type="datetime-local"
            step={1}
            value={dateText}
            onChange={(e) => handleDateText(e.target.value)}
          />
          {dateInvalid && (
            <p className="text-xs text-destructive">日時を入力してください</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="ts-value">タイムスタンプ</Label>
          <Input
            id="ts-value"
            type="text"
            inputMode="numeric"
            value={tsText}
            onChange={(e) => handleTsText(e.target.value)}
          />
          {tsInvalid ? (
            <p className="text-xs text-destructive">数値を入力してください</p>
          ) : (
            parsedTs &&
            unit === "auto" && (
              <p className="text-xs text-muted-foreground">
                {parsedTs.unit === "s" ? "秒" : "ミリ秒"}として扱っています
              </p>
            )
          )}
          <RadioGroup
            value={unit}
            onValueChange={(v) => handleUnit(v as TsUnit)}
            className="flex gap-4 pt-1"
          >
            {(
              [
                ["auto", "自動判定"],
                ["s", "秒"],
                ["ms", "ミリ秒"],
              ] as const
            ).map(([value, label]) => (
              <div key={value} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`unit-${value}`} />
                <Label htmlFor={`unit-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SHIFTS.map((s) => (
          <Button
            key={s.label}
            type="button"
            variant="outline"
            size="sm"
            disabled={!date}
            onClick={() => handleShift(s)}
          >
            {s.label}
          </Button>
        ))}
        <Button
          type="button"
          size="sm"
          onClick={() => {
            sync(new Date())
            toast.success("現在時刻にしました")
          }}
        >
          現在時刻
        </Button>
      </div>

      <div className="space-y-2 border-t pt-4">
        <CopyRow
          label="UNIX秒"
          value={date ? String(Math.floor(date.getTime() / 1000)) : ""}
        />
        <CopyRow
          label="UNIXミリ秒"
          value={date ? String(date.getTime()) : ""}
        />
        <CopyRow
          label="ISO 8601 (UTC)"
          value={date ? date.toISOString() : ""}
        />
        <CopyRow
          label="ローカル"
          value={date ? formatDate(date, "local") : ""}
        />
        <CopyRow label="UTC" value={date ? formatDate(date, "utc") : ""} />
      </div>
    </Card>
  )
}
