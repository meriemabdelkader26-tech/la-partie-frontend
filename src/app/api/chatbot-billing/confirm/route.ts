import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { setActiveSubscription } from "@/lib/server/chatbot-billing-store";

export const runtime = "nodejs";

type ConfirmBody = {
  sessionId?: string;
  userId?: string | null;
  email?: string | null;
};

const getStripeClient = (): Stripe | null => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key);
};

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

    const body = (await req.json()) as ConfirmBody;
    const sessionId = (body.sessionId || "").trim();

    if (!sessionId) {
      return NextResponse.json({ message: "Missing session id." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.status !== "complete") {
      return NextResponse.json(
        {
          message: "Checkout session is not completed.",
        },
        { status: 400 }
      );
    }

    const metaPlan = session.metadata?.chatbotPlan;
    const plan = metaPlan === "pro" ? "pro" : metaPlan === "plus" ? "plus" : null;

    if (!plan) {
      return NextResponse.json(
        {
          message: "Unable to infer chatbot plan from checkout session.",
        },
        { status: 400 }
      );
    }

    const stripeSub = typeof session.subscription === "object" ? session.subscription : null;

    const userId = body.userId || session.metadata?.userId || session.client_reference_id || null;
    const email = body.email || session.metadata?.email || session.customer_details?.email || null;

    const subscription = setActiveSubscription({
      userId,
      email,
      plan,
      stripeCustomerId: (session.customer as string) || null,
      stripeSubscriptionId: stripeSub?.id || null,
    });

    return NextResponse.json(
      {
        message: "Subscription activated.",
        currentPlan: subscription.plan,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to confirm checkout session.",
      },
      { status: 500 }
    );
  }
}
