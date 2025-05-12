"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

type OrderDetails = {
  id: string
  amount_total: number
  shipping: any
  payment_status: string
  customer_details: {
    email: string
    name: string
  }
  line_items: {
    data: Array<{
      description: string
      amount_total: number
      quantity: number
    }>
  }
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const { clearCart } = useCart()
  const [lastProductUrl, setLastProductUrl] = useState("/product")

  useEffect(() => {
    // 決済成功時にカートをクリア
    clearCart()

    // 最後に閲覧した商品ページのURLを取得
    const savedUrl = localStorage.getItem("lastViewedProduct")
    if (savedUrl) {
      setLastProductUrl(savedUrl)
    }

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

  // 買い物を続けるボタンのクリックハンドラ
  const handleContinueShopping = () => {
    router.push(lastProductUrl)
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-24 w-24 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">ご注文ありがとうございます！</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          ご注文を受け付けました。ご注文内容の確認メールをお送りしました。
        </p>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">注文情報を読み込み中...</p>
          </div>
        ) : orderDetails ? (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">注文詳細</h2>

            <div className="space-y-4 mb-6">
              <p className="font-medium">
                注文番号: <span className="font-normal">{orderDetails.id}</span>
              </p>
              <p className="font-medium">
                お支払い状況: <span className="font-normal text-green-600">完了</span>
              </p>
              {orderDetails.customer_details && (
                <p className="font-medium">
                  お客様情報:{" "}
                  <span className="font-normal block mt-1">
                    {orderDetails.customer_details.name}
                    <br />
                    {orderDetails.customer_details.email}
                  </span>
                </p>
              )}
              {orderDetails.shipping && (
                <p className="font-medium">
                  配送先:
                  <span className="font-normal block mt-1">
                    {orderDetails.shipping.address?.line1}
                    <br />
                    {orderDetails.shipping.address?.line2 && (
                      <>
                        {orderDetails.shipping.address.line2}
                        <br />
                      </>
                    )}
                    {orderDetails.shipping.address?.postal_code} {orderDetails.shipping.address?.city}
                    <br />
                    {orderDetails.shipping.address?.state} {orderDetails.shipping.address?.country}
                  </span>
                </p>
              )}
            </div>

            <h3 className="font-semibold mb-3 border-b pb-2">注文商品</h3>
            {orderDetails.line_items && orderDetails.line_items.data.length > 0 ? (
              <div className="space-y-4">
                {orderDetails.line_items.data.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium">{item.description?.split(",")[0] || "商品"}</p>
                      <p className="text-sm text-gray-600">数量: {item.quantity}</p>
                    </div>
                    <p className="font-medium">¥{(item.amount_total / 100).toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between pt-4 font-bold">
                  <span>合計金額</span>
                  <span>¥{(orderDetails.amount_total / 100).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">商品情報を取得できませんでした。</p>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg mb-8 text-center">
            <p className="text-yellow-800">注文情報を取得できませんでした。</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              <Home className="mr-2 h-5 w-5" />
              ホームに戻る
            </Button>
          </Link>
          <Button size="lg" onClick={handleContinueShopping}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            買い物を続ける
          </Button>
        </div>
      </div>
    </div>
  )
}
