"use server"
import Stripe from "stripe"
import type { CartItem } from "@/context/cart-context"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
})

// 日本語変換用のマップ定義
const templateMap = { horizontal: "横書き", vertical: "縦書き", fan: "推し活風" }
const fontMap = { overlapping: "かさなり文字", pop: "ポップ", mincho: "明朝体" }
const textureMap = { normal: "ノーマル", matte: "マット", silk: "シルク" }
const suffixMap = { chan: "ちゃん", kun: "くん", sama: "さま", san: "さん", oshi: "推し" }
// 装飾文字のIDと名前の対応 (app/product/page.tsx の decorations 配列を参考にしてください)
const decorationMap = {
  none: "なし",
  ribbon: "リボン",
  "heart-solid": "ハート",
  "heart-outline": "ハート(輪郭)",
  flower: "花",
  crown: "王冠",
  "star-outline": "星(輪郭)",
  cards: "トランプ",
  gem: "宝石",
  "star-solid": "星",
  moon: "月",
}

function formatCustomizationForDescription(customizations: CartItem["customizations"]): string {
  if (!customizations) return "標準商品"

  const parts: string[] = []

  if (customizations.template) {
    parts.push(`形式: ${templateMap[customizations.template] || customizations.template}`)
  }
  if (customizations.font) {
    parts.push(`フォント: ${fontMap[customizations.font] || customizations.font}`)
  }
  if (customizations.decoration) {
    parts.push(`装飾: ${decorationMap[customizations.decoration] || customizations.decoration}`)
  }
  if (customizations.baseColorName && customizations.baseTexture) {
    parts.push(
      `ベース: ${customizations.baseColorName} (${textureMap[customizations.baseTexture] || customizations.baseTexture})`,
    )
  }
  if (customizations.textColorName && customizations.textTexture) {
    parts.push(
      `文字色: ${customizations.textColorName} (${textureMap[customizations.textTexture] || customizations.textTexture})`,
    )
  }
  if (customizations.text) {
    // 入力文字が長すぎる場合に備えて、Stripeの説明文の文字数制限を考慮
    const shortText = customizations.text.substring(0, 100) // 例として100文字に制限
    parts.push(`入力文字: ${shortText}${customizations.text.length > 100 ? "..." : ""}`)
  }
  if (customizations.template === "fan" && customizations.suffix) {
    parts.push(`接尾辞: ${suffixMap[customizations.suffix] || customizations.suffix}`)
  }

  let description = parts.join(" / ")
  // Stripeの商品説明の文字数制限を考慮 (安全マージンを見て950文字でカット)
  if (description.length > 950) {
    description = description.substring(0, 950) + "..."
  }
  return description || "カスタムメイド商品"
}

export async function createCheckoutSession(items: CartItem[], customerEmail: string) {
  console.log("[Stripe Action] createCheckoutSession_v4 called (with detailed description)")
  console.log("[Stripe Action] STRIPE_SECRET_KEY is set:", !!process.env.STRIPE_SECRET_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL
  console.log("[Stripe Action] Resolved App URL:", appUrl)

  if (!appUrl) {
    console.error("[Stripe Action] Error: NEXT_PUBLIC_APP_URL (or NEXT_PUBLIC_BASE_URL) is not set.")
    return { error: "アプリケーションのURL設定が不完全です。お手数ですが、管理者にご連絡ください。" }
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("[Stripe Action] Error: STRIPE_SECRET_KEY is not set.")
    return { error: "決済サーバーの設定に問題があります。お手数ですが、管理者にご連絡ください。" }
  }
  if (!items || items.length === 0) {
    console.warn("[Stripe Action] Warning: Attempted to checkout with an empty cart.")
    return { error: "カートが空です。商品を追加してください。" }
  }

  try {
    const lineItems = items.map((item) => {
      const description = formatCustomizationForDescription(item.customizations)
      let imageUrl = `${appUrl}/placeholder.svg`
      if (item.image) {
        if (item.image.startsWith("http")) {
          imageUrl = item.image
        } else {
          imageUrl = `${appUrl}${item.image.startsWith("/") ? "" : "/"}${item.image}`
        }
      }
      console.log(
        `[Stripe Action] Preparing line item: Name='${item.name}', Price=${item.price}, Qty=${item.quantity}, Image='${imageUrl}', Desc='${description}'`,
      )
      return {
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
            description: description, // ここに詳細なカスタマイズ情報が入る
            images: [imageUrl].filter((url) => url && !url.endsWith("/placeholder.svg")),
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
    })

    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "送料",
          description: "オンライン販売開始記念！送料無料キャンペーン実施中",
        },
        unit_amount: 0,
      },
      quantity: 1,
    })

    console.log(
      "[Stripe Action] Final line_items for Stripe (with detailed description & campaign shipping):",
      JSON.stringify(lineItems, null, 2),
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart?cancelled=true`,
      customer_email: customerEmail || undefined,
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      metadata: {
        order_items_summary: JSON.stringify(
          items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
        ),
      },
    })

    console.log("[Stripe Action] Stripe session created. Session ID:", session.id)
    if (session.url) {
      console.log("[Stripe Action] Successfully obtained redirect URL:", session.url)
      return { url: session.url }
    } else {
      console.error("[Stripe Action] Error: Stripe session URL is null or undefined after session creation.")
      return { error: "決済セッションのURL取得に失敗しました。時間をおいて再度お試しください。" }
    }
  } catch (error: any) {
    console.error("[Stripe Action] Critical Error during Stripe session creation:", error)
    let detailedErrorMessage = "決済処理中に予期せぬエラーが発生しました。"
    if (error.raw && error.raw.message) {
      detailedErrorMessage = `Stripe APIエラー: ${error.raw.message}`
    } else if (error.message) {
      detailedErrorMessage = error.message
    }
    console.error("[Stripe Action] Detailed error message to return:", detailedErrorMessage)
    return { error: detailedErrorMessage }
  }
}
