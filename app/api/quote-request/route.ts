import { NextResponse } from "next/server"

// Google Apps ScriptのウェブアプリケーションURL
const webhookUrl =
  "https://script.google.com/macros/s/AKfycbyubOQZUEPugcqYj8OOHSdjgeEG4jxccZk2jR8EV5YN821mPncKH9n_-Tu0tMB2dW_p1Q/exec"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // データのバリデーション
    if (!data.quoteId || !data.customerInfo || !data.productDetails) {
      return NextResponse.json({ error: "必要なデータが不足しています" }, { status: 400 })
    }

    console.log("見積もりデータをGoogle Sheetsに送信:", data)

    // WebhookにPOSTリクエストを送信
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Webhook error: ${response.status} ${response.statusText}`, errorText)
      throw new Error(`Webhook error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json({ success: true, quoteId: data.quoteId, webhookResponse: result })
  } catch (error) {
    console.error("見積もり依頼の保存に失敗しました:", error)
    return NextResponse.json({ error: "見積もり依頼の保存に失敗しました" }, { status: 500 })
  }
}
