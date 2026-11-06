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
    <SidebarProvider>
      <Sidebar />
      <MobileMenuBar />
      <main className="flex-1 min-w-0 p-8 md:pl-10">{children}</main>
    </SidebarProvider>
  )
}
