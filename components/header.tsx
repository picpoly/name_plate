"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { getCartCount } = useCart()
  const [cartCount, setCartCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [currentBanner, setCurrentBanner] = useState(0)

  // 帯部分のテキスト
  const bannerTexts = [
    "フィギュア・アクセサリーオリジナルグッズ製作なら「PIC&POLY」 PIC&POLY",
    "🚚 税込11000円（税込）以上のお買い物で送料無料",
    "現在の納期目安はこちら",
  ]

  // クライアントサイドでのみカート数を取得
  useEffect(() => {
    setIsClient(true)
    setCartCount(getCartCount())

    const interval = setInterval(() => {
      setCartCount(getCartCount())
    }, 1000)

    return () => clearInterval(interval)
  }, [getCartCount])

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 帯部分の自動スライド
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerTexts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [bannerTexts.length])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // 前のバナーに移動
  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + bannerTexts.length) % bannerTexts.length)
  }

  // 次のバナーに移動
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % bannerTexts.length)
  }

  return (
    <header className={`w-full transition-all duration-200 ${isScrolled ? "bg-white shadow-md" : "bg-white"}`}>
      {/* トップバー */}
      <div className="bg-gray-100 py-2 text-sm relative">
        <div className="container mx-auto px-4 flex items-center justify-center">
          {/* 左矢印 */}
          <button
            onClick={prevBanner}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="前のお知らせ"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* バナーテキスト */}
          <div className="text-center overflow-hidden h-6">
            {bannerTexts.map((text, index) => (
              <div
                key={index}
                className={`transition-opacity duration-500 absolute left-0 right-0 ${
                  currentBanner === index ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {index === 2 ? (
                  <Link href="/delivery" className="text-gray-700 hover:text-[#f6be5a]">
                    {text}
                  </Link>
                ) : (
                  <span className="text-gray-700">{text}</span>
                )}
              </div>
            ))}
          </div>

          {/* 右矢印 */}
          <button
            onClick={nextBanner}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="次のお知らせ"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* メインヘッダー */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <Image src="/picpoly-logo.png" alt="PIC&POLY" width={180} height={50} priority />
          </Link>

          {/* 右側のナビゲーション */}
          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {isClient && cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[1.25rem] text-xs bg-[#f6be5a] text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* グローバルナビゲーション */}
      <nav className="bg-[#f6be5a] text-white">
        <div className="container mx-auto">
          <ul className="hidden md:flex justify-center">
            <li className="hover:bg-[#e5ad49] transition-colors">
              <Link href="/products" className="block px-4 py-3 text-sm font-medium">
                商品一覧
              </Link>
            </li>
            <li className="hover:bg-[#e5ad49] transition-colors">
              <Link href="/guide" className="block px-4 py-3 text-sm font-medium">
                ご利用ガイド
              </Link>
            </li>
            <li className="hover:bg-[#e5ad49] transition-colors">
              <Link href="/data-guide" className="block px-4 py-3 text-sm font-medium">
                データ制作ガイド
              </Link>
            </li>
            <li className="hover:bg-[#e5ad49] transition-colors">
              <Link href="/customer-orders" className="block px-4 py-3 text-sm font-medium">
                オーダー紹介
              </Link>
            </li>
            <li className="hover:bg-[#e5ad49] transition-colors">
              <Link href="/contact" className="block px-4 py-3 text-sm font-medium">
                お問い合わせ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                <Image src="/picpoly-logo.png" alt="PIC&POLY" width={150} height={40} />
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="py-2 border-b border-gray-200" onClick={() => setIsMenuOpen(false)}>
                商品一覧
              </Link>
              <Link href="/guide" className="py-2 border-b border-gray-200" onClick={() => setIsMenuOpen(false)}>
                ご利用ガイド
              </Link>
              <Link href="/data-guide" className="py-2 border-b border-gray-200" onClick={() => setIsMenuOpen(false)}>
                データ制作ガイド
              </Link>
              <Link
                href="/customer-orders"
                className="py-2 border-b border-gray-200"
                onClick={() => setIsMenuOpen(false)}
              >
                オーダー紹介
              </Link>
              <Link href="/contact" className="py-2 border-b border-gray-200" onClick={() => setIsMenuOpen(false)}>
                お問い合わせ
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
