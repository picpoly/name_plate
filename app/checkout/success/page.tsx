"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ExternalLink } from "lucide-react"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const sessionId = searchParams.get("session_id")

  // LINE友達追加ページのURL
  const lineUrl = "https://xanlic6j.autosns.app/line"

  useEffect(() => {
    // セッションIDがない場合はカートページにリダイレクト
    if (!sessionId) {
      router.push("/cart")
      return
    }

    // カートをクリア
    clearCart()

    // 注文情報の取得などの処理をここに追加できます
    // 実際のアプリケーションでは、セッションIDを使用してバックエンドから注文情報を取得します
  }, [sessionId, clearCart, router])

  // セッションIDがない場合はローディング表示
  if (!sessionId) {
    return <div className="container mx-auto px-4 py-12 text-center">読み込み中...</div>
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">ご注文ありがとうございます！</CardTitle>
          <CardDescription>注文番号: {sessionId.substring(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>ご注文内容の確認メールをお送りしました。メールが届かない場合は、お問い合わせください。</p>
          <p>商品は4〜7営業日以内に発送いたします。</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <a href={lineUrl} className="w-full">
            <Button className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              LINE公式アカウントを友達追加
            </Button>
          </a>
          <p className="text-sm text-center text-gray-500">
            LINE公式アカウントでは、お得な情報や新商品のお知らせをお届けします。
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
