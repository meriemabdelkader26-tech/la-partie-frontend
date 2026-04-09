import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentPlan } from "@/lib/server/chatbot-billing-store";

export const runtime = "nodejs";

type CheckoutBody = {
  plan?: "plus" | "pro";
  userId?: string | null;
  email?: string | null;
  returnPath?: string;
};

const getStripeClient = (): Stripe | null => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key);
};

const getPriceIdByPlan = (plan: "plus" | "pro"): string => {
  if (plan === "plus") {
    return process.env.STRIPE_CHATBOT_PLUS_PRICE_ID || "";
  }
  return process.env.STRIPE_CHATBOT_PRO_PRICE_ID || "";
};

const getBaseUrl = (req: NextRequest): string => {
  const envBase = process.env.NEXT_PUBLIC_BASE_URL;
  if (envBase) {
    return envBase;
  }

  const origin = req.headers.get("origin");
  if (origin) {
    return origin;
  }

  const host = req.headers.get("host") || "localhost:3001";
  const proto = host.includes("localhost") ? "http" : "https";
  return `${proto}://${host}`;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const currentPlan = getCurrentPlan({ userId, email });

  return NextResponse.json(
    {
      currentPlan,
      hasPaidPlan: currentPlan === "plus" || currentPlan === "pro",
    },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        {
          message: "Missing STRIPE_SECRET_KEY in environment.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as CheckoutBody;
    const plan = body.plan === "pro" ? "pro" : body.plan === "plus" ? "plus" : null;

    if (!plan) {
      return NextResponse.json({ message: "Invalid plan." }, { status: 400 });
    }

    const priceId = getPriceIdByPlan(plan);
    if (!priceId) {
      return NextResponse.json(
        {
          message: `Missing Stripe price id for ${plan}.`,
        },
        { status: 500 }
      );
    }

    const safeReturnPath = body.returnPath?.startsWith("/") ? body.returnPath : "/";
    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}${safeReturnPath}?chatbotBilling=success&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${safeReturnPath}?chatbotBilling=cancel`,
      client_reference_id: body.userId || undefined,
      customer_email: body.email || undefined,
      metadata: {
        chatbotPlan: plan,
        userId: body.userId || "",
        email: body.email || "",
      },
    });

    return NextResponse.json(
      {
        checkoutUrl: session.url,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to create checkout session.",
      },
      { status: 500 }
    );
  }
}
