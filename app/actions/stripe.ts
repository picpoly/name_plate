"use server"
import Stripe from "stripe"
import type { CartItem } from "@/context/cart-context"

// Stripe初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// 関数のシグネチャを更新して、デフォルト値のコメントを追加
export async function createCheckoutSession(items: CartItem[], customerEmail: string) {
  try {
    // 商品ラインアイテムを作成
    const lineItems = items.map((item) => {
      // カスタマイズ情報をフォーマット
      const customizationDetails = formatCustomizationDetails(item.customizations)

      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
            description: customizationDetails,
            images: [item.image.startsWith("http") ? item.image : `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`],
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

    // チェックアウトセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: customerEmail, // チェックアウトページで入力されたメールアドレスを使用
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
            display_name: "通常配送（4-7営業日）",
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

    return { url: session.url }
  } catch (error) {
    console.error("Stripe checkout error:", error)
    throw new Error("決済処理中にエラーが発生しました。")
  }
}

// カスタマイズ情報を読みやすい形式に変換
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
