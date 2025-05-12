import { loadStripe } from "@stripe/stripe-js"

// Stripeの公開キーを使用してStripeインスタンスを初期化
export const getStripe = () => {
  try {
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!stripePublishableKey) {
      console.error("Stripe publishable key is not set")
      return null
    }

    return loadStripe(stripePublishableKey)
  } catch (error) {
    console.error("Stripeの初期化に失敗しました:", error)
    return null
  }
}
