import { NextResponse } from "next/server"
import Stripe from "stripe"
import type { CartItem } from "@/context/cart-context"

// Stripeインスタンスの初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // 最新のAPIバージョンを使用
})

export async function POST(request: Request) {
  try {
    const { items, customerEmail } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "カート内に商品がありません" }, { status: 400 })
    }

    // originの取得とフォールバックURLの設定
    const origin = request.headers.get("origin") || request.headers.get("host")
    const baseUrl = origin ? (origin.startsWith("http") ? origin : `https://${origin}`) : "https://example.com" // フォールバックURL（v0プレビュー用）

    // 商品ラインアイテムの作成
    const lineItems = items.map((item: CartItem) => {
      // 画像URLの処理
      let imageUrl = item.image
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`
      }

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
            description: getItemDescription(item),
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
    })

    // 送料の追加
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "送料",
          description: "全国一律送料",
        },
        unit_amount: 185,
      },
      quantity: 1,
    })

    // v0プレビュー環境用の特別な処理
    // 実際のデプロイ時には削除または修正してください
    const successUrl = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/cart`

    console.log("Success URL:", successUrl)
    console.log("Cancel URL:", cancelUrl)

    // チェックアウトセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "jpy",
            },
            display_name: "通常配送（送料込み）",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 4,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "決済処理中にエラーが発生しました" }, { status: 500 })
  }
}

// 商品の説明文を生成するヘルパー関数
function getItemDescription(item: CartItem): string {
  const { customizations } = item
  const template =
    customizations.template === "horizontal" ? "横書き" : customizations.template === "vertical" ? "縦書き" : "推し活風"

  const font =
    customizations.font === "overlapping" ? "かさなり文字" : customizations.font === "pop" ? "ポップ" : "明朝体"

  let description = `テンプレート: ${template}, フォント: ${font}, `
  description += `ベースカラー: ${customizations.baseColorName}, テキストカラー: ${customizations.textColorName}, `
  description += `テキスト: ${customizations.text}`

  return description
}
