import type React from "react"
import { CartProvider } from "@/context/cart-context"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingCartButton } from "@/components/floating-cart-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "NamePlate Shop",
  description: "カスタムネームプレートキーホルダーショップ",
  generator: "v0.dev",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CartProvider>
            {children}
            <FloatingCartButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
