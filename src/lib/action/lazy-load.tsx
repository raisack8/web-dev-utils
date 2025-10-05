"use server"

// 並列実行を許可するために、各リクエストを独立して処理
export async function lazyDemo(index: number) {
  const startTime = Date.now()
  return `取得完了 index: ${index}`
}
