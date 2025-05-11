"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()

  useEffect(() => {
    // 決済成功時にカートをクリア
    clearCart()

    // セッションIDがある場合は注文詳細を取得
    if (sessionId) {
      fetchOrderDetails(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId, clearCart])

  const fetchOrderDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${id}`)
      const data = await response.json()

      if (data.session) {
        setOrderDetails(data.session)
      }
    } catch (error) {
      console.error("注文詳細の取得に失敗しました:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-gray-800">ご注文ありがとうございます！</h1>
        <p className="text-lg text-gray-600 mb-8">ご注文を受け付けました。ご注文内容の確認メールをお送りしました。</p>

        {sessionId && (
          <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left">
            <p className="font-medium mb-2">
              注文番号: <span className="font-normal">{sessionId}</span>
            </p>
            {orderDetails && (
              <>
                <p className="font-medium mb-2">
                  お支払い状況: <span className="font-normal text-green-600">完了</span>
                </p>
                <p className="font-medium">
                  配送先:
                  <span className="font-normal block mt-1">
                    {orderDetails.shipping?.address?.line1}
                    <br />
                    {orderDetails.shipping?.address?.line2 && (
                      <>
                        {orderDetails.shipping.address.line2}
                        <br />
                      </>
                    )}
                    {orderDetails.shipping?.address?.postal_code} {orderDetails.shipping?.address?.city}
                    <br />
                    {orderDetails.shipping?.address?.state} {orderDetails.shipping?.address?.country}
                  </span>
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="mr-2 h-5 w-5" />
              ホームに戻る
            </Button>
          </Link>
          <Link href="/product">
            <Button size="lg">
              <ShoppingBag className="mr-2 h-5 w-5" />
              買い物を続ける
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
