import { NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"

// Stripeの設定
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// Resendの設定（メール送信用）
const resend = new Resend(process.env.RESEND_API_KEY)

// Stripeからのウェブフックを処理する
export async function POST(request: Request) {
  const payload = await request.text()
  const signature = request.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    // Stripeからのイベントを検証
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // checkout.session.completed イベントを処理
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // セッションの詳細情報を取得
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer", "payment_intent"],
    })

    // 顧客のメールアドレス
    const customerEmail = expandedSession.customer_details?.email

    if (customerEmail) {
      try {
        // Resendを使用してメールを送信
        await resend.emails.send({
          from: "注文確認 <orders@yourcompany.com>",
          to: customerEmail,
          subject: "ご注文ありがとうございます",
          html: `
            <h1>ご注文ありがとうございます</h1>
            <p>注文番号: ${session.id}</p>
            <p>お支払い金額: ${(session.amount_total! / 100).toLocaleString()}円</p>
            <hr />
            <p>ご不明な点がございましたら、お気軽にお問い合わせください。</p>
          `,
        })
      } catch (error) {
        console.error("メール送信エラー:", error)
      }
    }
  }

  return NextResponse.json({ received: true })
}
