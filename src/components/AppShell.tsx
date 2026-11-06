"use client"

import { usePathname } from "next/navigation"
import MobileMenuBar from "@/components/MobileMenuBar"
import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

// ログイン画面(/auth)ではメニューを出さず、中身だけを表示する
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === "/auth") return <main>{children}</main>

  return (
    <SidebarProvider className="overflow-x-clip">
      <Sidebar />
      <MobileMenuBar />
      {/* サイドバーが出ている間は、画面全体を見た目だけ右にずらす(はみ出した分はスクロールしない) */}
      <main className="flex-1 min-w-0 p-8 md:pl-10 transition-transform duration-200 md:peer-hover/sidebar:translate-x-[calc(14rem_-_8px)] md:peer-has-[:focus-visible]/sidebar:translate-x-[calc(14rem_-_8px)]">
        {children}
      </main>
    </SidebarProvider>
  )
}
