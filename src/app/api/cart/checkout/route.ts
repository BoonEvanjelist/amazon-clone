import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthUser } from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // Calculate total in cents
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + Math.round(item.price * 100) * item.quantity,
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "inr",
      automatic_payment_methods: { enabled: true },
      metadata: {
        userId: user.userId,
        itemCount: items.length.toString(),
      },
      shipping: {
        name: shippingAddress.fullName,
        address: {
          line1: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zip,
          country: shippingAddress.country,
        },
        phone: shippingAddress.phone,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
