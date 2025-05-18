"use client"

import { useCart } from "@/context/cart-context"
import { CartItemComponent } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { getStripe } from "@/lib/stripe"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function CartPage() {
  const { items, getCartTotal } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const shippingCost = 185 // 送料
  const { toast } = useToast()

  // クライアントサイドでのみレンダリングするための対策
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // サーバーサイドレンダリング時は何も表示しない
  }

  // カートが空の場合
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 bg-white">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="mb-6">
            <ShoppingCart className="h-24 w-24 text-gray-300" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">カートは空です</h1>
          <p className="text-gray-600 mb-8">カートに商品がありません。商品を追加してください。</p>
          <Link href="/product">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              商品一覧に戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 合計金額の計算
  const subtotal = getCartTotal()
  const total = subtotal + shippingCost

  // Stripeチェックアウトを処理する関数
  const handleCheckout = async () => {
    try {
      setIsLoading(true)
      setDebugInfo("決済処理を開始します...")

      // v0プレビュー環境での問題を回避するための直接リダイレクト
      // 注意: これはテスト用の簡易的な実装です
      if (window.location.hostname.includes("v0.dev") || window.location.hostname.includes("localhost")) {
        setDebugInfo("v0環境を検出しました。テスト用リダイレクトを使用します。")
        toast({
          title: "テスト環境",
          description: "テスト環境では、Stripeの決済ページへのリダイレクトをシミュレートします。",
        })

        // 3秒後に成功ページにリダイレクト
        setTimeout(() => {
          window.location.href = "/checkout/success"
        }, 3000)
        return
      }

      // 実際の環境での処理
      setDebugInfo("APIリクエストを送信します...")

      // チェックアウトセッションを作成するAPIを呼び出す
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
          customerEmail: "", // 必要に応じてユーザーのメールアドレスを追加
        }),
      })

      setDebugInfo(`APIレスポンス: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        const errorText = await response.text()
        setDebugInfo(`APIエラー: ${errorText}`)
        throw new Error(`決済処理中にエラーが発生しました: ${errorText}`)
      }

      const data = await response.json()
      setDebugInfo(`APIデータ: ${JSON.stringify(data)}`)

      const { sessionId, url, error } = data

      if (error) {
        setDebugInfo(`APIからのエラー: ${error}`)
        toast({
          title: "エラー",
          description: error,
          variant: "destructive",
        })
        return
      }

      // Stripeのチェックアウトページにリダイレクト
      if (url) {
        setDebugInfo(`URLにリダイレクトします: ${url}`)
        window.location.href = url
      } else if (sessionId) {
        // Stripe.js を使用してチェックアウトを開始
        setDebugInfo("Stripe.jsを使用してチェックアウトを開始します...")
        const stripe = await getStripe()

        if (!stripe) {
          setDebugInfo("Stripeインスタンスの取得に失敗しました")
          throw new Error("Stripeの初期化に失敗しました")
        }

        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId })

        if (stripeError) {
          setDebugInfo(`Stripeエラー: ${stripeError.message}`)
          throw new Error(stripeError.message)
        }
      } else {
        setDebugInfo("URLもsessionIdも返されませんでした")
        throw new Error("決済情報が正しく返されませんでした")
      }
    } catch (error) {
      console.error("決済処理中にエラーが発生しました:", error)
      setDebugInfo(`キャッチされたエラー: ${error.message}`)
      toast({
        title: "エラー",
        description: error.message || "決済処理中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 bg-white flex-grow">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">ショッピングカート</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* カート商品リスト */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">カート内の商品</h2>

              <div className="divide-y">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    const lastUrl = localStorage.getItem("lastViewedProduct") || "/product"
                    window.location.href = lastUrl
                  }}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  買い物を続ける
                </Button>
              </div>
            </div>
          </div>

          {/* 注文サマリー */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">注文内容</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span className="text-gray-800">¥{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span className="text-gray-800">¥{shippingCost.toLocaleString()}</span>
                </div>

                <div className="pt-4 border-t flex justify-between font-bold">
                  <span className="text-gray-800">合計</span>
                  <span className="text-gray-800">¥{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
                  <CreditCard className="mr-2 h-5 w-5" />
                  {isLoading ? "処理中..." : "購入手続きへ進む"}
                </Button>

                <div className="text-xs text-gray-600 text-center">
                  <p>※クレジットカード決済に対応しています</p>
                  <p>※Stripeの安全な決済ページに移動します</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-center space-x-2">
                  <Truck className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">4〜7営業日で発送</span>
                </div>
              </div>

              {/* デバッグ情報（開発環境でのみ表示） */}
              {process.env.NODE_ENV !== "production" && debugInfo && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600 overflow-auto max-h-40">
                  <p className="font-semibold">デバッグ情報:</p>
                  <pre>{debugInfo}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
