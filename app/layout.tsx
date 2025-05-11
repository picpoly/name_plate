import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"
import { FloatingCartButton } from "@/components/floating-cart-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ネームプレートキーホルダー",
  description: "カスタマイズ可能なネームプレートキーホルダー",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-white text-gray-800`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <CartProvider>
            {children}
            <FloatingCartButton />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
