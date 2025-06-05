"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ShoppingBag, Check } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createCheckoutSession } from "@/app/actions/stripe"

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // フォームの状態
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    postalCode: "",
    prefecture: "",
    city: "",
    address1: "",
    address2: "",
    notes: "",
  })

  // フォーム入力の処理
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // 注文を確定する関数
  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    console.log("handleSubmitOrder called") // Log: 関数呼び出し確認
    setIsSubmitting(true)
    console.log("Items to checkout:", items) // Log: カートアイテム確認
    console.log("Customer email:", formData.email) // Log: メールアドレス確認

    try {
      // Stripe決済セッションを作成（メールアドレスのみ渡す）
      const result = await createCheckoutSession(items, formData.email)
      console.log("Stripe session result:", result) // Log: Stripeアクションの結果確認

      if (result && result.url) {
        console.log("Redirecting to Stripe URL:", result.url) // Log: リダイレクトURL確認
        window.location.href = result.url
      } else {
        // エラーメッセージを具体的に表示
        const errorMessage = result && result.error ? result.error : "決済URLの取得に失敗しました。"
        console.error("Failed to get Stripe session URL. Result:", result)
        alert(`${errorMessage} 問題が解決しない場合は、管理者にお問い合わせください。`)
        setIsSubmitting(false) // isSubmittingを解除
      }
    } catch (error) {
      console.error("決済処理エラー (catch block):", error)
      alert("決済処理中に予期せぬエラーが発生しました。もう一度お試しください。")
      setIsSubmitting(false)
    }
  }

  // 注文完了画面
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">ご注文ありがとうございます！</CardTitle>
            <CardDescription>
              注文番号:{" "}
              {Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              ご注文内容の確認メールを{formData.email}に送信しました。メールが届かない場合は、お問い合わせください。
            </p>
            <p>商品は4〜7営業日以内に発送いたします。</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                <ShoppingBag className="mr-2 h-4 w-4" />
                ショップに戻る
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // カートが空の場合
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">チェックアウト</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">カートに商品がありません</h2>
          <p className="text-gray-500 mb-6">チェックアウトを行うには、商品をカートに追加してください</p>
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
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-2xl font-bold mb-8">チェックアウト</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 注文フォーム */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">お届け先情報</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="lastName">姓</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">名</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="postalCode">郵便番号</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="123-4567"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="prefecture">都道府県</Label>
                  <Input
                    id="prefecture"
                    name="prefecture"
                    value={formData.prefecture}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">市区町村</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="address1">番地・建物名</Label>
                <Input id="address1" name="address1" value={formData.address1} onChange={handleInputChange} required />
              </div>

              <div className="mb-4">
                <Label htmlFor="address2">部屋番号など（任意）</Label>
                <Input id="address2" name="address2" value={formData.address2} onChange={handleInputChange} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">備考</h2>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="配送に関するご要望などがあればご記入ください"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center">
              <Link href="/cart">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  カートに戻る
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "処理中..." : <>注文を確定する</>}
              </Button>
            </div>
          </form>
        </div>

        {/* 注文サマリー */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">注文内容</h2>

            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items">
                <AccordionTrigger>商品一覧 ({totalItems}点)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.customizations?.text || "名前"}
                            {item.customizations?.template === "fan" &&
                              item.customizations?.suffix &&
                              getSuffixName(item.customizations.suffix)}
                          </p>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs">数量: {item.quantity}</p>
                            <p className="text-sm font-medium">¥{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="my-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>小計</span>
                <span>¥{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>送料</span>
                <span>¥185</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>合計</span>
                <span>¥{(totalPrice + 185).toLocaleString()}</span>
              </div>
              <div className="text-xs text-gray-500 text-right">（税込）</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 接尾辞を日本語に変換する関数
function getSuffixName(suffix: string) {
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
