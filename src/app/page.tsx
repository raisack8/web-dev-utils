import Image from "next/image"
import Link from "next/link"
import { Button } from "../components/ui/button"

export default function Page() {
  const documents = [
    {
      name: "Next.js",
      url: "https://nextjs.org/docs",
      icon: "/icons/nextjs.ico",
    },
    {
      name: "Vercel",
      url: "https://vercel.com/docs",
      icon: "/icons/vercel.ico",
    },
    {
      name: "Shadcn",
      url: "https://ui.shadcn.com/docs/components",
      icon: "/icons/shadcn.ico",
    },
    {
      name: "Auth.js",
      url: "https://authjs.dev/getting-started",
      icon: "/icons/authjs.png",
    },
    {
      name: "Supabase Auth",
      url: "https://supabase.com/docs/guides/auth",
      icon: "/icons/supabase.png",
    },
    {
      name: "Claude Code",
      url: "https://docs.claude.com/en/docs/claude-code/overview",
      icon: "/icons/claude.ico",
    },
    {
      name: "Resend",
      url: "https://resend.com/docs/dashboard/emails/introduction",
      icon: "/icons/resend.png",
    },
    {
      name: "Upstash",
      url: "https://console.upstash.com/redis",
      icon: "/icons/upstash.png",
    },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Web Dev Utils
            </h1>
            <p className="text-xl text-muted-foreground">Web開発ツールキット</p>
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground/90">
              よく使用するドキュメント
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((d) => (
                <Link
                  key={d.name}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:scale-105 hover:border-primary/50">
                    <div className="flex items-center gap-3">
                      {d.icon && (
                        <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <Image
                            src={d.icon}
                            alt={d.name}
                            width={24}
                            height={24}
                            className="w-6 h-6"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {d.name}
                        </h3>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
