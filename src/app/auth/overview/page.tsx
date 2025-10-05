import { Card } from "@/components/ui/card"

export default function AuthOverviewPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">NextAuth.js 認証設定</h1>
          <p className="text-muted-foreground">
            Google、X（Twitter）、LINE認証の設定方法
          </p>
        </div>

        {/* Quick Start */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🚀 クイックスタート</h2>
          <div className="space-y-3">
            <p>
              デモアカウントでログインする場合は、設定不要です。
              <a
                href="/auth"
                className="text-primary hover:underline ml-1 font-medium"
              >
                /auth
              </a>
              ページにアクセスしてください。
            </p>
            <div className="bg-muted p-4 rounded-md font-mono text-sm">
              <div>Email: demo@example.com</div>
              <div>Password: password</div>
            </div>
          </div>
        </Card>

        {/* Google OAuth */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google OAuth 設定
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Google Cloud Console</h3>
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://console.cloud.google.com/
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                にアクセスし、プロジェクトを作成
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                2. OAuth 2.0 クライアント ID を作成
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>「APIs & Services」→「認証情報」を選択</li>
                <li>「OAuth クライアント ID を作成」をクリック</li>
                <li>アプリケーションの種類：「ウェブアプリケーション」</li>
                <li>
                  承認済みのリダイレクト URI：
                  <code className="bg-muted px-1 rounded">
                    http://localhost:3000/api/auth/callback/google
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. 環境変数に設定</h3>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <div>GOOGLE_CLIENT_ID=your-client-id</div>
                <div>GOOGLE_CLIENT_SECRET=your-client-secret</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Twitter OAuth */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter) OAuth 設定
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Twitter Developer Portal</h3>
              <a
                href="https://developer.twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://developer.twitter.com/
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                にアクセスし、アプリを作成
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. OAuth 2.0 を有効化</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>「User authentication settings」を編集</li>
                <li>OAuth 2.0 を有効にする</li>
                <li>Type of App：「Web App」</li>
                <li>
                  Callback URL：
                  <code className="bg-muted px-1 rounded">
                    http://localhost:3000/api/auth/callback/twitter
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. 環境変数に設定</h3>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <div>TWITTER_CLIENT_ID=your-client-id</div>
                <div>TWITTER_CLIENT_SECRET=your-client-secret</div>
              </div>
            </div>
          </div>
        </Card>

        {/* LINE OAuth */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINE OAuth 設定
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. LINE Developers</h3>
              <a
                href="https://developers.line.biz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://developers.line.biz/
              </a>
              <p className="text-sm text-muted-foreground mt-1">
                にアクセスし、プロバイダーとチャネルを作成
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. LINE Login チャネル設定</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>チャネルタイプ：「LINE Login」</li>
                <li>
                  Callback URL：
                  <code className="bg-muted px-1 rounded">
                    http://localhost:3000/api/auth/callback/line
                  </code>
                </li>
                <li>「LINE Login設定」タブでOpenID Connectを有効化</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. 環境変数に設定</h3>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                <div>LINE_CLIENT_ID=your-channel-id</div>
                <div>LINE_CLIENT_SECRET=your-channel-secret</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Environment Variables */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">🔐 環境変数の設定</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              プロジェクトルートに <code className="bg-muted px-1 rounded">.env.local</code> ファイルを作成し、以下を設定してください：
            </p>
            <div className="bg-muted p-4 rounded-md font-mono text-sm space-y-1">
              <div className="text-muted-foreground"># NextAuth</div>
              <div>NEXTAUTH_URL=http://localhost:3000</div>
              <div>NEXTAUTH_SECRET=your-secret-key-here</div>
              <div className="mt-2 text-muted-foreground"># Google OAuth</div>
              <div>GOOGLE_CLIENT_ID=your-google-client-id</div>
              <div>GOOGLE_CLIENT_SECRET=your-google-client-secret</div>
              <div className="mt-2 text-muted-foreground">
                # Twitter (X) OAuth
              </div>
              <div>TWITTER_CLIENT_ID=your-twitter-client-id</div>
              <div>TWITTER_CLIENT_SECRET=your-twitter-client-secret</div>
              <div className="mt-2 text-muted-foreground"># LINE OAuth</div>
              <div>LINE_CLIENT_ID=your-line-channel-id</div>
              <div>LINE_CLIENT_SECRET=your-line-channel-secret</div>
            </div>
            <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
              <span className="text-xl">💡</span>
              <div className="text-sm">
                <p className="font-semibold mb-1">NEXTAUTH_SECRETの生成</p>
                <p className="text-muted-foreground">
                  ターミナルで以下を実行してシークレットキーを生成：
                </p>
                <code className="block mt-2 bg-muted px-2 py-1 rounded">
                  openssl rand -base64 32
                </code>
              </div>
            </div>
          </div>
        </Card>

        {/* Testing */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">✅ テスト</h2>
          <div className="space-y-3">
            <p>設定が完了したら、認証をテストしてください：</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                <a
                  href="/auth"
                  className="text-primary hover:underline ml-1"
                >
                  /auth
                </a>
                ページにアクセス
              </li>
              <li>各プロバイダーのボタンをクリックして認証フローをテスト</li>
              <li>認証成功後、トップページにリダイレクトされることを確認</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  )
}
