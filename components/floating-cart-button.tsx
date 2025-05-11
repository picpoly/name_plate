"use client"

import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function FloatingCartButton() {
  const { getCartCount } = useCart()
  const router = useRouter()
  const [cartCount, setCartCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // クライアントサイドでのみカート数を取得
  useEffect(() => {
    setIsClient(true)
    setCartCount(getCartCount())
  }, [getCartCount])

  // カート数の変更を監視
  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        setCartCount(getCartCount())
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isClient, getCartCount])

  // カートページに移動
  const goToCart = () => {
    router.push("/cart")
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={goToCart}
        size="icon"
        className="h-20 w-20 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 transition-all"
      >
        <ShoppingCart className="h-10 w-10 text-white" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 px-2 py-1 min-w-[1.75rem] text-sm bg-red-500 text-white border-2 border-white">
            {cartCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
