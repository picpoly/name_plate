"use client"

import type React from "react"

import { useState, type FormEvent } from "react" // FormEventをインポート
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { createCheckoutSession } from "@/app/actions/stripe"

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart() // clearCart は success ページで呼ぶのでここでは不要かも
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmitOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Checkout form submitted. Current form data:", formData)
    setIsSubmitting(true)

    if (items.length === 0) {
      alert("カートに商品がありません。商品ページから商品を追加してください。")
      setIsSubmitting(false)
      router.push("/product")
      return
    }
    if (!formData.email || !formData.email.includes("@")) {
      alert("有効なメールアドレスを入力してください。")
      setIsSubmitting(false)
      return
    }

    try {
      console.log(
        "[Checkout Page] Calling createCheckoutSession with items:",
        JSON.stringify(items.map((i) => ({ id: i.id, name: i.name }))),
        "and email:",
        formData.email,
      )
      const result = await createCheckoutSession(items, formData.email)
      console.log("[Checkout Page] Result from createCheckoutSession:", result)

      if (result && result.url) {
        console.log("[Checkout Page] Successfully received redirect URL. Redirecting to Stripe:", result.url)
        window.location.href = result.url
      } else if (result && result.error) {
        console.error("[Checkout Page] Error from createCheckoutSession:", result.error)
        alert(
          `決済セッションの開始に失敗しました: ${result.error}\n\nお手数ですが、入力内容をご確認いただくか、時間をおいて再度お試しください。問題が解決しない場合は、管理者にお問い合わせください。`,
        )
        setIsSubmitting(false)
      } else {
        console.error("[Checkout Page] Unknown error: createCheckoutSession returned an unexpected result:", result)
        alert("決済セッションの開始に失敗しました。予期せぬエラーが発生しました。")
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error("[Checkout Page] Critical error during handleSubmitOrder:", error)
      alert("決済処理の呼び出し中に重大なエラーが発生しました。ページをリロードして再度お試しください。")
      setIsSubmitting(false)
    }
  }

  // カートが空の場合の表示はそのまま

  if (items.length === 0 && !isSubmitting) {
    // isSubmitting中は表示しない
    // この部分は初回レンダリング時やカートが空になった場合に表示される
    // router.pushで遷移させた方がUXが良いかもしれない
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
              {/* フォーム項目は変更なし */}
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
                  placeholder="例: 123-4567"
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
                placeholder="配送に関するご要望などがあればご記入ください (任意)"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-between items-center">
              <Link href="/cart">
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  {" "}
                  {/* type="button" を追加 */}
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  カートに戻る
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "処理中..." : "注文を確定する"}
              </Button>
            </div>
          </form>
        </div>

        {/* 注文サマリー */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">注文内容</h2>
            {/* ... (商品一覧アコーディオンはそのまま) ... */}
            <Accordion type="single" collapsible defaultValue="items">
              <AccordionItem value="items">
                <AccordionTrigger>商品一覧 ({totalItems}点)</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain"
                            unoptimized={item.image?.startsWith("/texture/") || item.image?.startsWith("/decoration-")}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.customizations?.text ? item.customizations.text.substring(0, 30) : "カスタム詳細"}
                            {item.customizations?.text && item.customizations.text.length > 30 ? "..." : ""}
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
          </div>
        </div>
      </div>
    </div>
  )
}

// getSuffixName 関数は変更なし
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
