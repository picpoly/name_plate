import { loadStripe } from "@stripe/stripe-js"

// Stripeの公開キーを使用してStripeインスタンスを初期化
export const getStripe = () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!stripePublishableKey) {
    throw new Error("Stripe publishable key is not set")
  }

  return loadStripe(stripePublishableKey)
}
