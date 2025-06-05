import { cookies } from "next/headers"
import type { CartItem } from "@/types"
import { stripe } from "@/lib/stripe"
import { redirect } from "next/navigation"

export async function createCheckoutSession(items: CartItem[]) {
  const cartId = cookies().get("cartId")?.value

  if (!items || items.length === 0) {
    return { message: "Cart is empty" }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?cancelled=true`,
    metadata: {
      order_items: JSON.stringify(
        items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      ),
    },
  })

  if (session?.url) {
    return redirect(session.url)
  } else {
    return { message: "Failed to create checkout session" }
  }
}
