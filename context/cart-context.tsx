"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// カート内の商品アイテムの型定義
export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  customizations: {
    template: string
    font: string
    decoration: string
    baseColor: string
    baseColorName: string
    textColor: string
    textColorName: string
    text: string
    baseTexture: string // 追加
    textTexture: string // 追加
    suffix?: string
    texture: string
  }
}

// カートコンテキストの型定義
type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  updateItem: (id: string, updatedItem: CartItem) => void
}

// デフォルト値を持つカートコンテキストを作成
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0,
  updateItem: () => {},
})

// カートプロバイダーコンポーネント
export function CartProvider({ children }: { children: ReactNode }) {
  // カートアイテムの状態
  const [items, setItems] = useState<CartItem[]>([])

  // ページ読み込み時にローカルストレージからカート情報を復元
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("カートの復元に失敗しました", error)
        setItems([])
      }
    }
  }, [])

  // カートが更新されたらローカルストレージに保存
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items])

  // カートに商品を追加する関数
  const addItem = (newItem: CartItem) => {
    setItems((prevItems) => {
      // 同じIDの商品が既にカートにあるか確認
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id)

      if (existingItemIndex >= 0) {
        // 既存のアイテムの数量を増やす
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // 新しいアイテムを追加
        return [...prevItems, newItem]
      }
    })
  }

  // カート内の商品の数量を更新する関数
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // カートから商品を削除する関数
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    // カートが空になったらローカルストレージからも削除
    if (items.length === 1) {
      localStorage.removeItem("cart")
    }
  }

  // カート内の商品を更新する関数
  const updateItem = (id: string, updatedItem: CartItem) => {
    setItems((prevItems) => prevItems.map((item) => (item.id === id ? updatedItem : item)))
  }

  // カートを空にする関数
  const clearCart = () => {
    setItems([])
    localStorage.removeItem("cart")
  }

  // カートの合計金額を計算する関数
  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // カート内のアイテム数を取得する関数
  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getCartTotal,
        getCartCount,
        updateItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// カートコンテキストを使用するためのカスタムフック
export function useCart() {
  return useContext(CartContext)
}
