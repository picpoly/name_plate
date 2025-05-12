import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "セッションIDが必要です" }, { status: 400 })
  }

  try {
    // セッション情報を詳細に取得（商品情報も含む）
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items.data", "customer", "payment_intent", "shipping"],
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error("セッション取得エラー:", error)
    return NextResponse.json({ error: "セッション情報の取得に失敗しました" }, { status: 500 })
  }
}
