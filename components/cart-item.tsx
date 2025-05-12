"use client"

import { useCart, type CartItem } from "@/context/cart-context"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CartItemProps {
  item: CartItem
}

// 装飾文字の配列を追加
const decorations = [
  { id: "none", name: "なし" },
  { id: "ribbon", name: "リボン" },
  { id: "heart-solid", name: "ハート" },
  { id: "heart-outline", name: "ハート（輪郭）" },
  { id: "flower", name: "花" },
  { id: "crown", name: "王冠" },
  { id: "star-outline", name: "星（輪郭）" },
  { id: "cards", name: "トランプ" },
  { id: "gem", name: "宝石" },
  { id: "star-solid", name: "星" },
  { id: "moon", name: "月" },
]

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [isDeleting, setIsDeleting] = useState(false)

  // 削除の確認
  const handleDelete = () => {
    if (isDeleting) {
      removeItem(item.id)
    } else {
      setIsDeleting(true)
      // 3秒後に削除モードをリセット
      setTimeout(() => setIsDeleting(false), 3000)
    }
  }

  // 数量の増減
  const decreaseQuantity = () => {
    updateQuantity(item.id, item.quantity - 1)
  }

  const increaseQuantity = () => {
    updateQuantity(item.id, item.quantity + 1)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b pb-6 mb-6">
      {/* 商品画像 */}
      <div className="w-full md:w-1/4 relative aspect-square md:aspect-auto md:h-32">
        <Link href={`/product?id=${item.id}`}>
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain rounded-md" />
        </Link>
      </div>

      {/* 商品情報 */}
      <div className="w-full md:w-3/4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <Link href={`/product?id=${item.id}`} className="text-lg font-semibold hover:underline text-gray-800">
              {item.name}
            </Link>

            <div className="text-lg font-bold text-gray-800">¥{item.price.toLocaleString()}</div>
          </div>

          {/* カスタマイズ情報 */}
          <div className="text-sm text-gray-600 mt-1 space-y-1">
            <p>
              <span className="font-medium">テンプレート:</span>{" "}
              {item.customizations.template === "horizontal"
                ? "横書き"
                : item.customizations.template === "vertical"
                  ? "縦書き"
                  : "推し活風"}
            </p>
            <p>
              <span className="font-medium">フォント:</span>{" "}
              {item.customizations.font === "overlapping"
                ? "かさなり文字"
                : item.customizations.font === "pop"
                  ? "ポップ"
                  : "明朝体"}
            </p>
            <p>
              <span className="font-medium">ベースカラー:</span> {item.customizations.baseColorName}（
              {item.customizations.texture === "normal"
                ? "ノーマル"
                : item.customizations.texture === "matte"
                  ? "マット"
                  : "シルク"}
              ）
            </p>
            <p>
              <span className="font-medium">テキストカラー:</span> {item.customizations.textColorName}（
              {item.customizations.texture === "normal"
                ? "ノーマル"
                : item.customizations.texture === "matte"
                  ? "マット"
                  : "シルク"}
              ）
            </p>
            <p>
              <span className="font-medium">入力文字:</span> {item.customizations.text}
            </p>
            <p>
              <span className="font-medium">装飾文字:</span>{" "}
              {decorations.find((d) => d.id === item.customizations.decoration)?.name || "なし"}
            </p>
            {item.customizations.suffix && (
              <p>
                <span className="font-medium">接尾辞:</span>{" "}
                {item.customizations.suffix === "chan"
                  ? "ちゃん"
                  : item.customizations.suffix === "kun"
                    ? "くん"
                    : item.customizations.suffix === "sama"
                      ? "さま"
                      : item.customizations.suffix === "san"
                        ? "さん"
                        : "推し"}
              </p>
            )}
          </div>
        </div>

        {/* 数量調整と削除ボタン */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decreaseQuantity}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-gray-800">{item.quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={increaseQuantity}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button variant={isDeleting ? "destructive" : "ghost"} size="sm" onClick={handleDelete} className="text-sm">
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "削除確認" : "削除"}
          </Button>
        </div>
      </div>
    </div>
  )
}
