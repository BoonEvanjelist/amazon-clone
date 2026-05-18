import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      stripePaymentIntentId,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = body;

    const order = await Order.create({
      user: user.userId,
      items,
      shippingAddress,
      paymentMethod,
      stripePaymentIntentId,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentStatus: stripePaymentIntentId ? "paid" : "pending",
      isPaid: !!stripePaymentIntentId,
      paidAt: stripePaymentIntentId ? new Date() : undefined,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ user: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
