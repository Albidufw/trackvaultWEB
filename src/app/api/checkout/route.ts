import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items } = body;

    console.log("Incoming checkout items:", items);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items to purchase." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const trackIds = Array.isArray(items)
      ? items.map((item: any) => item?.trackId).filter(Boolean).join(",")
      : "";

      console.log("Incoming checkout items:", items);
      console.log("User ID:", user.id);
      console.log("Track IDs:", trackIds);
      

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title || `Track ${item.id}`,
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: 1,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        userId: String(user.id),
        trackIds,
      },
    });

    console.log("Stripe session metadata:", checkoutSession.metadata);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}
