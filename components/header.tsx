"use client"

import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              NamePlate Shop
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-sm font-medium hover:text-blue-500 transition-colors">
              商品一覧
            </Link>
            <Link href="/custom" className="text-sm font-medium hover:text-blue-500 transition-colors">
              カスタマイズ
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-blue-500 transition-colors">
              ショップについて
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-blue-500 transition-colors">
              お問い合わせ
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              商品一覧
            </Link>
            <Link
              href="/custom"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              カスタマイズ
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              ショップについて
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
              onClick={toggleMenu}
            >
              お問い合わせ
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
