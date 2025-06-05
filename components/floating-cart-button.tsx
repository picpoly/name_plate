"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { usePathname } from "next/navigation" // usePathnameをインポート

export function FloatingCartButton() {
  const { totalItems } = useCart()
  const pathname = usePathname() // 現在のパスを取得

  // 商品ページ以外では何も表示しない
  if (pathname !== "/product") {
    return null
  }

  return (
    <Link href="/cart" passHref>
      <Button
        variant="outline"
        size="icon"
        // 位置を画面右下に変更
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-white shadow-lg rounded-full h-14 w-14 md:h-16 md:w-16 z-50 flex items-center justify-center group hover:bg-gray-50 transition-colors"
        aria-label={`カートを見る (${totalItems}点の商品)`}
      >
        <ShoppingCart className="h-7 w-7 md:h-8 md:w-8 text-gray-700 group-hover:text-primary transition-colors" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center border-2 border-white">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  )
}
