import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
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
