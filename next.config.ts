import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    // ESLint の警告でビルドが停止しないように
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript の型チェックエラーでビルドが停止しないように（必要に応じて）
    ignoreBuildErrors: false,
  },
}

export default nextConfig
