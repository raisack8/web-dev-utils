import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OverviewPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Redis データ型 概要</h1>
        <p className="text-muted-foreground text-lg">
          Redisは高速なインメモリデータストアで、5つの基本データ型を提供しています。
          各データ型には特徴的なユースケースがあり、適切に使い分けることで効率的なアプリケーションを構築できます。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">1. String（文字列型）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">概要</h3>
            <p className="text-muted-foreground">
              最もシンプルなデータ型で、キーと値の1対1の関係を保存します。
              文字列だけでなく、数値やバイナリデータも保存できます。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">主なコマンド</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  SET key value
                </code>{" "}
                - 値を設定
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">GET key</code> -
                値を取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">INCR key</code> -
                数値を1増加
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">DEL key</code> -
                キーを削除
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">ユースケース</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>セッション情報の保存</li>
              <li>カウンター（ページビュー数、いいね数など）</li>
              <li>キャッシュデータ</li>
              <li>一時的なトークンやフラグ</li>
            </ul>
          </div>

          <Link href="/string">
            <Button className="mt-4">String型を試す →</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">2. List（リスト型）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">概要</h3>
            <p className="text-muted-foreground">
              順序を保持した文字列のコレクションです。両端からの追加・削除が高速で、
              リンクリストとして実装されています。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">主なコマンド</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  LPUSH key value
                </code>{" "}
                - 先頭に追加
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  RPUSH key value
                </code>{" "}
                - 末尾に追加
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">LPOP key</code> -
                先頭から取り出し
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  LRANGE key start stop
                </code>{" "}
                - 範囲取得
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">ユースケース</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>タイムライン（SNSの投稿など）</li>
              <li>メッセージキュー</li>
              <li>最近のアクティビティログ</li>
              <li>履歴管理</li>
            </ul>
          </div>

          <Link href="/list">
            <Button className="mt-4">List型を試す →</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">3. Hash（ハッシュ型）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">概要</h3>
            <p className="text-muted-foreground">
              フィールドと値のペアを持つマップ構造です。
              オブジェクトや構造体を表現するのに最適で、メモリ効率も優れています。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">主なコマンド</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  HSET key field value
                </code>{" "}
                - フィールドを設定
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  HGET key field
                </code>{" "}
                - フィールドを取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">HGETALL key</code>{" "}
                - 全フィールドを取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  HDEL key field
                </code>{" "}
                - フィールドを削除
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">ユースケース</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>ユーザープロフィール（user:1 → name, email, age）</li>
              <li>商品情報の保存</li>
              <li>設定値の管理</li>
              <li>セッションデータ</li>
            </ul>
          </div>

          <Link href="/hash">
            <Button className="mt-4">Hash型を試す →</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">4. Set（セット型）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">概要</h3>
            <p className="text-muted-foreground">
              重複のない文字列の集合です。順序は保証されませんが、
              メンバーの存在チェックや集合演算（和集合、積集合など）が高速です。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">主なコマンド</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  SADD key member
                </code>{" "}
                - メンバーを追加
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  SISMEMBER key member
                </code>{" "}
                - 存在確認
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">SMEMBERS key</code>{" "}
                - 全メンバーを取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  SREM key member
                </code>{" "}
                - メンバーを削除
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">ユースケース</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>タグ管理（記事のタグなど）</li>
              <li>重複排除リスト（ユニークな訪問者など）</li>
              <li>権限管理（ロール、パーミッション）</li>
              <li>共通の友人検索（集合演算）</li>
            </ul>
          </div>

          <Link href="/set">
            <Button className="mt-4">Set型を試す →</Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            5. Sorted Set（ソート済みセット型）
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">概要</h3>
            <p className="text-muted-foreground">
              各メンバーにスコア（浮動小数点数）が関連付けられた集合です。
              スコア順に自動的にソートされ、範囲検索やランキング取得が高速です。
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">主なコマンド</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  ZADD key score member
                </code>{" "}
                - メンバーを追加
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  ZRANK key member
                </code>{" "}
                - 順位を取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  ZSCORE key member
                </code>{" "}
                - スコアを取得
              </li>
              <li>
                <code className="bg-muted px-2 py-1 rounded">
                  ZRANGE key start stop
                </code>{" "}
                - 範囲取得
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">ユースケース</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>リーダーボード（ゲームのスコアランキング）</li>
              <li>優先度付きキュー</li>
              <li>時系列データ（タイムスタンプをスコアとして使用）</li>
              <li>レート制限（スライディングウィンドウ）</li>
            </ul>
          </div>

          <Link href="/sorted-set">
            <Button className="mt-4">Sorted Set型を試す →</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-2xl">データ型の選び方</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">シンプルな値を保存したい</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>String</strong> を使用
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">順序が重要なリスト</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>List</strong> を使用
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">オブジェクトを保存したい</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>Hash</strong> を使用
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">重複を許さない集合</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>Set</strong> を使用
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">ランキングやスコア管理</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>Sorted Set</strong> を使用
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">時系列データの保存</h3>
              <p className="text-sm text-muted-foreground">
                → <strong>Sorted Set</strong> を使用
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
