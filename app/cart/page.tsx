"use client"

import { useCart } from "@/context/cart-context"
import { CartItemComponent } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { ShoppingCart, ArrowLeft, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getStripe } from "@/lib/stripe"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, getCartTotal } = useCart()
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

      // チェックアウトセッションを作成するAPIを呼び出す
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items,
        }),
      })

      const { sessionId, url, error } = await response.json()

      if (error) {
        toast({
          title: "エラー",
          description: error,
          variant: "destructive",
        })
        return
      }

      // Stripeのチェックアウトページにリダイレクト
      if (url) {
        window.location.href = url
      } else {
        // Stripe.js を使用してチェックアウトを開始
        const stripe = await getStripe()
        await stripe?.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("決済処理中にエラーが発生しました:", error)
      toast({
        title: "エラー",
        description: "決済処理中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
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
              <Link href="/product">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  買い物を続ける
                </Button>
              </Link>
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

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-center space-x-2">
                <Image src="/visa-application-process.png" alt="Visa" width={40} height={24} />
                <Image src="/mastercard-logo-abstract.png" alt="Mastercard" width={40} height={24} />
                <Image src="/abstract-credit-card-design.png" alt="American Express" width={40} height={24} />
                <Image src="/yellow-construction-vehicle.png" alt="JCB" width={40} height={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
