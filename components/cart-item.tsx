"use client"

import { useCart, type CartItem } from "@/context/cart-context"
import Image from "next/image"
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
  const { updateQuantity, removeItem, updateItem } = useCart()
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedItem, setEditedItem] = useState<CartItem>({ ...item })
  const [isEditing, setIsEditing] = useState(false)

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

  const saveChanges = () => {
    // 編集した内容で商品を更新
    updateItem(item.id, editedItem)

    // 編集モードを終了
    setIsEditing(false)
  }

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 商品画像 */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
        </div>

        {/* 商品情報 */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <p className="font-medium text-gray-900">¥{item.price.toLocaleString()}</p>
          </div>

          {/* カスタマイズ情報 */}
          {item.customizations && (
            <div className="text-sm text-gray-600 space-y-1 mt-2">
              {/* ネームプレートキーホルダーの場合 */}
              {item.name === "ネームプレートキーホルダー" && (
                <>
                  <p>
                    テンプレート:{" "}
                    {item.customizations.template === "horizontal"
                      ? "横書き"
                      : item.customizations.template === "vertical"
                        ? "縦書き"
                        : "推し活風"}
                  </p>
                  <p>
                    フォント:{" "}
                    {item.customizations.font === "overlapping"
                      ? "かさなり文字"
                      : item.customizations.font === "pop"
                        ? "ポップ"
                        : "明朝体"}
                  </p>
                  <p>装飾文字: {item.customizations.decoration === "none" ? "なし" : item.customizations.decoration}</p>
                  <p>
                    ベースカラー: {item.customizations.baseColorName}（
                    {item.customizations.baseTexture === "normal"
                      ? "ノーマル"
                      : item.customizations.baseTexture === "matte"
                        ? "マット"
                        : "シルク"}
                    ）
                  </p>
                  <p>
                    テキストカラー: {item.customizations.textColorName}（
                    {item.customizations.textTexture === "normal"
                      ? "ノーマル"
                      : item.customizations.textTexture === "matte"
                        ? "マット"
                        : "シルク"}
                    ）
                  </p>
                  <p>入力文字: {item.customizations.text}</p>
                  {item.customizations.template === "fan" && (
                    <p>
                      接尾辞:{" "}
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
                </>
              )}

              {/* ペットフィギュアの場合 */}
              {item.name === "ペットフィギュア" && (
                <>
                  {item.customizations.petType && <p>ペットの種類: {item.customizations.petType}</p>}
                  {item.customizations.figureSize && <p>サイズ: {item.customizations.figureSize}</p>}
                  {item.customizations.figureColors && (
                    <div>
                      <p>フィギュア本体カラー:</p>
                      <ul className="ml-4">
                        {item.customizations.figureColors.map((color, index) => (
                          <li key={index}>
                            {color.partName}: {color.colorName}（{color.texture}）
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.customizations.baseOption && <p>台座オプション: {item.customizations.baseOption}</p>}
                  {item.customizations.baseOption !== "台座なし" && item.customizations.baseColor && (
                    <p>
                      台座カラー: {item.customizations.baseColor}（{item.customizations.baseTexture}）
                    </p>
                  )}
                  {item.customizations.uploadedFileName && (
                    <p>アップロードファイル: {item.customizations.uploadedFileName}</p>
                  )}
                  {item.customizations.designFileName && <p>デザインファイル: {item.customizations.designFileName}</p>}
                  {item.customizations.notes && <p>備考: {item.customizations.notes}</p>}
                </>
              )}

              {/* 子どもおえかきフィギュアの場合 */}
              {item.name === "子どもおえかきフィギュア" && (
                <>
                  <p>
                    台座オプション:{" "}
                    {item.customizations.baseOption === "standard"
                      ? "標準台座"
                      : item.customizations.baseOption === "none"
                        ? "台座なし"
                        : "デザイン台座"}
                  </p>
                  <p>台座カラー: {item.customizations.baseColor}</p>
                  {item.customizations.notes && <p>備考: {item.customizations.notes}</p>}
                </>
              )}

              {/* SDフィギュアの場合 */}
              {item.name === "人物SDフィギュア" && (
                <>
                  {item.customizations.figureSize && <p>サイズ: {item.customizations.figureSize}</p>}
                  {item.customizations.figureColors && (
                    <div>
                      <p>フィギュア本体カラー:</p>
                      <ul className="ml-4">
                        {item.customizations.figureColors.map((color, index) => (
                          <li key={index}>
                            {color.partName}: {color.colorName}（{color.texture}）
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.customizations.baseOption && <p>台座オプション: {item.customizations.baseOption}</p>}
                  {item.customizations.baseOption !== "台座なし" && item.customizations.baseColor && (
                    <p>
                      台座カラー: {item.customizations.baseColor}（{item.customizations.baseTexture}）
                    </p>
                  )}
                  {item.customizations.uploadedFileName && (
                    <p>アップロードファイル: {item.customizations.uploadedFileName}</p>
                  )}
                  {item.customizations.designFileName && <p>デザインファイル: {item.customizations.designFileName}</p>}
                  {item.customizations.notes && <p>備考: {item.customizations.notes}</p>}
                </>
              )}

              {/* マスコットフィギュアの場合 */}
              {item.name === "マスコットフィギュア" && (
                <>
                  {item.customizations.figureSize && <p>サイズ: {item.customizations.figureSize}</p>}
                  {item.customizations.figureColors && (
                    <div>
                      <p>フィギュア本体カラー:</p>
                      <ul className="ml-4">
                        {item.customizations.figureColors.map((color, index) => (
                          <li key={index}>
                            {color.partName}: {color.colorName}（{color.texture}）
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.customizations.baseOption && <p>台座オプション: {item.customizations.baseOption}</p>}
                  {item.customizations.baseOption !== "台座なし" && item.customizations.baseColor && (
                    <p>
                      台座カラー: {item.customizations.baseColor}（{item.customizations.baseTexture}）
                    </p>
                  )}
                  {item.customizations.uploadedFileName && (
                    <p>アップロードファイル: {item.customizations.uploadedFileName}</p>
                  )}
                  {item.customizations.designFileName && <p>デザインファイル: {item.customizations.designFileName}</p>}
                  {item.customizations.notes && <p>備考: {item.customizations.notes}</p>}
                </>
              )}
            </div>
          )}

          {/* 数量と削除ボタン */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">数量:</span>
              <div className="flex items-center border rounded">
                <button
                  className="px-2 py-1 border-r"
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                >
                  -
                </button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button className="px-2 py-1 border-l" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <button className="text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
