"use server"
import Stripe from "stripe"
import type { CartItem } from "@/context/cart-context"

// Stripe初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// カスタマイズ情報を読みやすい形式に変換 (変更なし)
function formatCustomizationDetails(customizations: any) {
  if (!customizations) return ""

  const templateMap = {
    horizontal: "横書き",
    vertical: "縦書き",
    fan: "推し活風",
  }

  const fontMap = {
    overlapping: "かさなり文字",
    pop: "ポップ",
    mincho: "明朝体",
  }

  const textureMap = {
    normal: "ノーマル",
    matte: "マット",
    silk: "シルク",
  }

  const suffixMap = {
    chan: "ちゃん",
    kun: "くん",
    sama: "さま",
    san: "さん",
    oshi: "推し",
  }

  const details = [
    `テキスト: ${customizations.text || "名前"}`,
    `テンプレート: ${templateMap[customizations.template] || customizations.template}`,
    `フォント: ${fontMap[customizations.font] || customizations.font}`,
    `装飾: ${customizations.decoration === "none" ? "なし" : customizations.decoration}`,
    `ベース: ${customizations.baseColorName} (${textureMap[customizations.baseTexture] || customizations.baseTexture})`,
    `テキスト: ${customizations.textColorName} (${textureMap[customizations.textTexture] || customizations.textTexture})`,
  ]

  if (customizations.template === "fan" && customizations.suffix) {
    details.push(`接尾辞: ${suffixMap[customizations.suffix] || customizations.suffix}`)
  }

  return details.join(" / ")
}

// 元の関数シグネチャに戻しつつ、メールアドレスを受け取るようにする
export async function createCheckoutSession(items: CartItem[], customerEmail: string) {
  console.log("[Stripe Action] createCheckoutSession called")
  console.log(
    "[Stripe Action] Items:",
    JSON.stringify(
      items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations ? Object.keys(item.customizations) : null,
      })),
      null,
      2,
    ),
  ) // カスタマイズ内容はキーのみ表示
  console.log("[Stripe Action] Customer Email:", customerEmail)
  console.log("[Stripe Action] STRIPE_SECRET_KEY available:", !!process.env.STRIPE_SECRET_KEY)
  console.log("[Stripe Action] NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL)

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[Stripe Action] STRIPE_SECRET_KEY is not set.")
    return { error: "サーバー設定エラー: Stripeシークレットキーが設定されていません。" }
  }
  if (!process.env.NEXT_PUBLIC_BASE_URL) {
    console.error("[Stripe Action] NEXT_PUBLIC_BASE_URL is not set.")
    // 警告に留め、処理は続行するが、success/cancel URLに影響する可能性
  }

  try {
    // 商品ラインアイテムを作成
    const lineItems = items.map((item) => {
      const customizationDetails = formatCustomizationDetails(item.customizations)
      const imageUrl = item.image.startsWith("http")
        ? item.image
        : `${process.env.NEXT_PUBLIC_BASE_URL || ""}${item.image.startsWith("/") ? item.image : `/${item.image}`}`

      console.log(`[Stripe Action] Processing item: ${item.name}, Image URL: ${imageUrl}`)

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
            description: customizationDetails,
            images: [imageUrl],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
    })

    // 送料を追加
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "送料",
          description: "全国一律",
        },
        unit_amount: 185,
      },
      quantity: 1,
    })
    console.log("[Stripe Action] Line items prepared:", JSON.stringify(lineItems, null, 2))

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/cart`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0, // 通常配送料は商品代金に含めるか、別途設定するためここでは0円
              currency: "jpy",
            },
            display_name: "通常配送（4-7営業日）", // Stripe Checkout画面での表示名
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
      metadata: {
        order_items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            customizations: item.customizations,
          })),
        ),
      },
    })
    console.log("[Stripe Action] Stripe session created. URL:", session.url)

    if (!session.url) {
      console.error("[Stripe Action] Stripe session URL is missing from the response!")
      return { error: "StripeセッションURLの取得に失敗しました。" }
    }

    return { url: session.url }
  } catch (error) {
    console.error("[Stripe Action] Stripe checkout error:", error.message, error.stack)
    return { error: `決済処理中にエラーが発生しました: ${error.message}` }
  }
}
