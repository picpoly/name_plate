"use server"
import Stripe from "stripe"
import type { CartItem } from "@/context/cart-context" // CartItemのインポートパスを確認してください

// Stripe初期化
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16", // 必要に応じて最新のAPIバージョンに更新
  typescript: true,
})

// カスタマイズ情報を簡潔な説明文に変換するヘルパー関数
function formatCustomizationForDescription(customizations: any): string {
  if (!customizations) return "標準商品"

  const parts: string[] = []
  if (customizations.template) {
    const templateMap = { horizontal: "横書き", vertical: "縦書き", fan: "推し活風" }
    parts.push(`形式: ${templateMap[customizations.template] || customizations.template}`)
  }
  if (customizations.text) {
    const shortText = customizations.text.substring(0, 20)
    parts.push(`文字: ${shortText}${customizations.text.length > 20 ? "..." : ""}`)
  }
  if (customizations.font) {
    const fontMap = { overlapping: "かさなり", pop: "ポップ", mincho: "明朝" }
    parts.push(`フォント: ${fontMap[customizations.font] || customizations.font}`)
  }
  // 必要に応じて他の主要なカスタマイズ情報を追加（簡潔に）

  return parts.join(", ") || "カスタム商品"
}

export async function createCheckoutSession(items: CartItem[], customerEmail: string) {
  console.log("[Stripe Action] createCheckoutSession_v3 called") // ログでバージョンを識別
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

  console.log(
    "[Stripe Action] Items to process:",
    JSON.stringify(
      items.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      null,
      2,
    ),
  )
  console.log("[Stripe Action] Customer email for session:", customerEmail)

  try {
    const lineItems = items.map((item) => {
      const description = formatCustomizationForDescription(item.customizations)
      let imageUrl = `${appUrl}/placeholder.svg` // デフォルトのプレースホルダー画像
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
            description: description.substring(0, 1000), // Stripeの商品説明は1000文字以内
            images: [imageUrl].filter((url) => url && !url.endsWith("/placeholder.svg")), // 有効な画像URLのみ渡す
          },
          unit_amount: item.price, // JPYの場合、金額は円単位
        },
        quantity: item.quantity,
      }
    })

    // 送料のラインアイテム
    lineItems.push({
      price_data: {
        currency: "jpy",
        product_data: {
          name: "送料",
          description: "国内配送料",
        },
        unit_amount: 185, // 送料
      },
      quantity: 1,
    })

    console.log("[Stripe Action] Final line_items for Stripe:", JSON.stringify(lineItems, null, 2))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart?cancelled=true`, // キャンセル時の戻り先
      customer_email: customerEmail || undefined, // メールアドレスがない場合はundefined
      shipping_address_collection: {
        allowed_countries: ["JP"],
      },
      metadata: {
        // メタデータは簡潔に
        order_items_summary: JSON.stringify(
          items.map((item) => ({ id: item.id, name: item.name, quantity: item.quantity })),
        ),
      },
    })

    console.log("[Stripe Action] Stripe session created. Session ID:", session.id)
    if (session.url) {
      console.log("[Stripe Action] Successfully obtained redirect URL:", session.url)
      return { url: session.url } // URLをクライアントに返す
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
