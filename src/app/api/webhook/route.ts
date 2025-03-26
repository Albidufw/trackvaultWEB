// src/app/api/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  let event;

  try {
    const body = await req.text();

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = parseInt(session.metadata?.userId || "0", 10);
    const trackIdsString = session.metadata?.trackIds || "";

    if (!userId || !trackIdsString) {
      console.error("❌ Missing metadata:", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const trackIds = trackIdsString
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    try {
      for (const trackId of trackIds) {
        await prisma.purchase.create({
          data: {
            userId,
            trackId,
            amount: session.amount_total
              ? session.amount_total / 100
              : 0, // store per-track amount if needed
          },
        });
      }

      console.log("✅ Purchases saved:", { userId, trackIds });
    } catch (err) {
      console.error("❌ Failed to save purchases:", err);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
