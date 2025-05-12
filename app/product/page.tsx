"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { useCart } from "@/context/cart-context"

export default function CheckoutSuccessPage() {
  const router = useRouter()
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
  }, [clearCart])

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

        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">ご注文ありがとうございました！</h1>

        <div className="flex justify-center">
          <Button size="lg" onClick={handleContinueShopping}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            お買い物を続ける
          </Button>
        </div>
      </div>
    </div>
  )
}
