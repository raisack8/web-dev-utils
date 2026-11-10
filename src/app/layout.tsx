import type { Metadata } from "next"
import { DotGothic16, Geist_Mono } from "next/font/google"
import "./globals.css"
import AppShell from "@/components/AppShell"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

// 日本語グリフはunicode-range分割で配信されるため、preloadはlatinのみ指定
const dotGothic = DotGothic16({
  variable: "--font-dotgothic",
  weight: "400",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Web Dev Utils",
  description: "Web開発ツールキット",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* 保存済みの配色を描画前に反映する(ちらつき防止) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("palette")==="mono")document.documentElement.dataset.palette="mono"}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${dotGothic.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          // 旧設定(system等)が残っていても黒背景を既定にするため、保存キーを変える
          storageKey="theme-v2"
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
