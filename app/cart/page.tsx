"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, AlertCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // 商品の数量を変更する関数
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1
    if (newQuantity > 10) newQuantity = 10
    updateQuantity(id, newQuantity)
  }

  // チェックアウトに進む関数
  const handleCheckout = () => {
    setIsCheckingOut(true)
    // チェックアウトページに遷移
    router.push("/checkout")
  }

  // テンプレート名を日本語に変換する関数
  const getTemplateName = (template: string) => {
    switch (template) {
      case "horizontal":
        return "横書き"
      case "vertical":
        return "縦書き"
      case "fan":
        return "推し活風"
      default:
        return template
    }
  }

  // フォント名を日本語に変換する関数
  const getFontName = (font: string) => {
    switch (font) {
      case "overlapping":
        return "かさなり文字"
      case "pop":
        return "ポップ"
      case "mincho":
        return "明朝体"
      default:
        return font
    }
  }

  // 質感名を日本語に変換する関数
  const getTextureName = (texture: string) => {
    switch (texture) {
      case "normal":
        return "ノーマル"
      case "matte":
        return "マット"
      case "silk":
        return "シルク"
      default:
        return texture
    }
  }

  // 接尾辞を日本語に変換する関数
  const getSuffixName = (suffix: string) => {
    switch (suffix) {
      case "chan":
        return "ちゃん"
      case "kun":
        return "くん"
      case "sama":
        return "さま"
      case "san":
        return "さん"
      case "oshi":
        return "推し"
      default:
        return suffix
    }
  }

  // カートが空の場合
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">ショッピングカート</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">カートは空です</h2>
          <p className="text-gray-500 mb-6">商品をカートに追加してください</p>
          <Link href="/product">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              商品ページに戻る
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">ショッピングカート</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* カート商品リスト */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">カート内の商品 ({totalItems}点)</h2>

            {items.map((item) => (
              <div key={item.id} className="mb-6 last:mb-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 商品画像 */}
                  <div className="relative w-full sm:w-32 h-32 rounded-md overflow-hidden bg-gray-100">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="font-semibold">¥{item.price.toLocaleString()}</p>
                    </div>

                    {/* カスタマイズ情報のアコーディオン */}
                    {item.customizations && (
                      <Accordion type="single" collapsible className="mt-2">
                        <AccordionItem value="customizations">
                          <AccordionTrigger className="text-sm py-2">カスタマイズ詳細</AccordionTrigger>
                          <AccordionContent>
                            <ul className="text-sm space-y-1 text-gray-600">
                              <li>
                                <span className="font-medium">テンプレート:</span>{" "}
                                {getTemplateName(item.customizations.template)}
                              </li>
                              <li>
                                <span className="font-medium">フォント:</span> {getFontName(item.customizations.font)}
                              </li>
                              <li>
                                <span className="font-medium">装飾文字:</span>{" "}
                                {item.customizations.decoration === "none" ? "なし" : item.customizations.decoration}
                              </li>
                              <li>
                                <span className="font-medium">ベースカラー:</span> {item.customizations.baseColorName} (
                                {getTextureName(item.customizations.baseTexture)})
                              </li>
                              <li>
                                <span className="font-medium">テキストカラー:</span> {item.customizations.textColorName}{" "}
                                ({getTextureName(item.customizations.textTexture)})
                              </li>
                              <li>
                                <span className="font-medium">入力文字:</span> {item.customizations.text}
                              </li>
                              {item.customizations.template === "fan" && item.customizations.suffix && (
                                <li>
                                  <span className="font-medium">接尾辞:</span>{" "}
                                  {getSuffixName(item.customizations.suffix)}
                                </li>
                              )}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {/* 数量変更と削除 */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <span className="text-sm mr-2">数量:</span>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max="10"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                            className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>削除</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="mt-6" />
              </div>
            ))}
          </div>
        </div>

        {/* 注文サマリー */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">注文サマリー</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>小計</span>
                <span>¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>送料</span>
                <div className="text-right">
                  <p className="text-xs text-green-600 font-semibold">オンライン販売開始記念！</p>
                  <p className="text-xs text-green-600 font-semibold mb-1">送料無料キャンペーン実施中</p>
                  <span className="line-through text-gray-500">¥185</span>
                  <span className="font-semibold ml-2">¥0</span>
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>合計</span>
                {/* 送料を0円として計算 */}
                <span>¥{(totalPrice + 0).toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 text-right">（税込）</div>
            </div>

            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>お届け日数</AlertTitle>
              <AlertDescription>ご注文確定後、4〜7営業日以内に発送いたします。</AlertDescription>
            </Alert>

            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? (
                "処理中..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  注文手続きへ進む
                </>
              )}
            </Button>

            <div className="mt-4">
              <Link href="/product">
                <Button variant="link" className="text-sm w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  買い物を続ける
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
