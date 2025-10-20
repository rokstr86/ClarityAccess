// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = (await req.json()) as {
      email?: string;
      plan?: "free" | "personal" | "enterprise";
    };
    if (!plan) return NextResponse.json({ error: "Plan not specified" }, { status: 400 });

    const secret = process.env.STRIPE_SECRET_KEY!;
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    // Pricing IDs (from your Stripe dashboard)
    const prices: Record<string, string> = {
      personal: process.env.STRIPE_PRICE_PERSONAL!,
      enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
    };
    const price = prices[plan];
    if (!price && plan !== "free")
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    if (plan === "free") return NextResponse.json({ url: "/scan" });

    const domain = process.env.NEXT_PUBLIC_DOMAIN!;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      customer_email: email,
      success_url: `${domain}/scan?status=success`,
      cancel_url: `${domain}/pricing?status=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}