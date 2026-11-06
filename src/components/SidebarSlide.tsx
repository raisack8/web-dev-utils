"use client"

import { useRef } from "react"

// 普段は左端の細い帯だけを見せ、ホバーまたはキーボードフォーカスでスライドして表示する。
// メニューを押したとき・マウスが離れたとき・Escapeのときはフォーカスも外して閉じる
export default function SidebarSlide({
  children,
}: {
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const release = () => {
    const active = document.activeElement
    if (active instanceof HTMLElement && ref.current?.contains(active)) {
      active.blur()
    }
  }

  return (
    <div
      ref={ref}
      className="peer/sidebar hidden md:block fixed inset-y-0 left-0 z-40 w-[14rem] -translate-x-[calc(100%_-_8px)] transition-transform duration-200 hover:translate-x-0 has-[:focus-visible]:translate-x-0 after:absolute after:inset-y-0 after:right-0 after:w-1 after:bg-primary"
      onMouseLeave={release}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) release()
      }}
      onKeyDown={(e) => e.key === "Escape" && release()}
    >
      {children}
    </div>
  )
}
