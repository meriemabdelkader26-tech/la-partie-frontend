import { NextResponse } from "next/server";
import {
  canAccessRequestedPlan,
  getCurrentPlan,
  getDailyUsageStore,
  getUsageKey,
} from "@/lib/server/chatbot-billing-store";

type RoleType = "influencer" | "brand";

type ChatMessage = {
  from: "assistant" | "user";
  text: string;
};

type RequestBody = {
  role: RoleType;
  mode?: "free" | "plus" | "pro";
  pagePath?: string;
  userId?: string | null;
  email?: string | null;
  userMessage: string;
  history?: ChatMessage[];
  pageContext?: {
    path?: string;
    headings?: string[];
    quickStats?: string[];
    queryCache?: Array<{
      key: string;
      summary: string;
    }>;
  };
};

type ChatApiResponse = {
  answer: string;
  source?: "openai" | "fallback" | "error";
  reason?: string;
  remainingFreeQuestions?: number;
  dailyLimit?: number;
  upgradeRequired?: boolean;
  currentPlan?: "free" | "plus" | "pro";
};

const INFLUENCER_FALLBACK: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ["profile", "bio", "photo", "complete"],
    answer:
      "To optimize your influencer profile: complete all fields, keep niche and value proposition clear, add quality visual portfolio, and keep social metrics updated.",
  },
  {
    keys: ["campaign", "apply", "application", "proposal"],
    answer:
      "To improve campaign acceptance: apply only to relevant offers, write concise value-driven proposals, and include realistic reach and timeline.",
  },
  {
    keys: ["engagement", "reach", "followers", "content"],
    answer:
      "For better engagement: publish consistently, improve hooks in the first seconds, add clear CTA, and analyze best performing formats weekly.",
  },
  {
    keys: ["payment", "payout", "money", "escrow"],
    answer:
      "For faster payouts: keep payment details valid, deliver assets on time, and provide clear completion proof to reduce review delays.",
  },
];

const BRAND_FALLBACK: Array<{ keys: string[]; answer: string }> = [
  {
    keys: ["campaign", "brief", "objective", "create"],
    answer:
      "For high-performing campaigns: set one primary objective, define audience and deliverables, and include precise acceptance criteria in the brief.",
  },
  {
    keys: ["influencer", "choose", "select", "fit"],
    answer:
      "Prioritize creator-audience fit, engagement quality, and content consistency before follower size to improve conversion quality.",
  },
  {
    keys: ["review", "application", "approve", "reject"],
    answer:
      "Use a scoring workflow (fit, quality, reliability, budget) to review applications quickly and consistently.",
  },
  {
    keys: ["roi", "performance", "kpi", "result"],
    answer:
      "Track ROI with approval rate, content on-time rate, conversion/click outcome, and cost per engagement depending on your campaign objective.",
  },
];

const getFallbackAnswer = (role: RoleType, input: string): string => {
  const normalized = input.toLowerCase();
  const source = role === "influencer" ? INFLUENCER_FALLBACK : BRAND_FALLBACK;

  for (const item of source) {
    if (item.keys.some((key) => normalized.includes(key))) {
      return item.answer;
    }
  }

  return role === "influencer"
    ? "I can answer questions about profile optimization, campaign applications, engagement strategy, and payouts. Ask one specific question for a focused answer."
    : "I can answer questions about campaign planning, influencer selection, application workflow, and ROI tracking. Ask one specific question for a focused answer.";
};

const buildSystemPrompt = (
  role: RoleType,
  pagePath: string,
  pageContext?: RequestBody["pageContext"]
): string => {
  const roleContext =
    role === "influencer"
      ? "You are an assistant dedicated to influencers using InfluBridge."
      : "You are an assistant dedicated to brands/companies using InfluBridge.";

  const headings = (pageContext?.headings || []).slice(0, 6).join(" | ");
  const quickStats = (pageContext?.quickStats || []).slice(0, 10).join(" | ");
  const cache = (pageContext?.queryCache || [])
    .slice(0, 6)
    .map((item) => `${item.key}: ${item.summary}`)
    .join(" || ");

  return [
    roleContext,
    "Give concise, actionable answers with practical steps.",
    "When useful, provide short checklists and prioritize platform-specific guidance.",
    "Avoid making up unavailable data. If unknown, say what to check next.",
    `Current page path: ${pagePath}`,
    `Visible page headings: ${headings || "none"}`,
    `Visible page quick stats/text: ${quickStats || "none"}`,
    `Real-time query cache context: ${cache || "none"}`,
    "Use this real-time context to tailor your answer to current offers, stats, profile, and page state.",
  ].join(" ");
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const role: RoleType = body.role === "brand" ? "brand" : "influencer";
    const requestedMode =
      body.mode === "plus" || body.mode === "pro" || body.mode === "free"
        ? body.mode
        : "free";
    const pagePath = body.pagePath || "/";
    const pageContext = body.pageContext;
    const userMessage = (body.userMessage || "").trim();
    const history = Array.isArray(body.history) ? body.history.slice(-12) : [];
    const dailyLimit = Number(process.env.CHATBOT_DAILY_FREE_AI_LIMIT || 3);

    const usageStore = getDailyUsageStore();
    const usageKey = getUsageKey(body.userId);
    const usedToday = usageStore.get(usageKey) || 0;
    const remainingFreeQuestions = Math.max(dailyLimit - usedToday, 0);
    const currentPlan = getCurrentPlan({ userId: body.userId, email: body.email });

    if (!userMessage) {
      return NextResponse.json({ answer: "Please ask a question." }, { status: 200 });
    }

    if (!canAccessRequestedPlan(currentPlan, requestedMode)) {
      const response: ChatApiResponse = {
        answer:
          requestedMode === "pro"
            ? "Pro requires an active Pro subscription at $25/month. Upgrade to continue."
            : "Plus requires an active Plus subscription at $12/month. Upgrade to continue.",
        source: "fallback",
        reason: "paid_plan_required",
        remainingFreeQuestions,
        dailyLimit,
        upgradeRequired: true,
        currentPlan,
      };
      return NextResponse.json(response, { status: 200 });
    }

    if (requestedMode === "free") {
      if (remainingFreeQuestions <= 0) {
        const response: ChatApiResponse = {
          answer:
            "You reached your free chatbot limit for today (3 messages). Upgrade to Plus ($12/month) or Pro ($25/month) for unlimited AI answers.",
          source: "fallback",
          reason: "daily_free_limit_reached",
          remainingFreeQuestions: 0,
          dailyLimit,
          upgradeRequired: true,
          currentPlan,
        };
        return NextResponse.json(response, { status: 200 });
      }

      usageStore.set(usageKey, usedToday + 1);

      const response: ChatApiResponse = {
        answer: getFallbackAnswer(role, userMessage),
        source: "fallback",
        reason: "free_simple_mode",
        remainingFreeQuestions: Math.max(dailyLimit - (usedToday + 1), 0),
        dailyLimit,
        currentPlan,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const openAiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!openAiKey) {
      const response: ChatApiResponse = {
        answer: getFallbackAnswer(role, userMessage),
        source: "fallback",
        reason: "OPENAI_API_KEY missing in server env",
        remainingFreeQuestions,
        dailyLimit,
        currentPlan,
      };
      return NextResponse.json(response, { status: 200 });
    }

    const messages = [
      {
        role: "system",
        content: buildSystemPrompt(role, pagePath, pageContext),
      },
      ...history.map((msg) => ({
        role: msg.from === "assistant" ? "assistant" : "user",
        content: msg.text,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: openAiModel,
        messages,
        temperature: requestedMode === "pro" ? 0.35 : 0.3,
        max_tokens: requestedMode === "pro" ? 500 : 320,
      }),
    });

    if (!response.ok) {
      let reason = `OpenAI HTTP ${response.status}`;
      try {
        const errPayload = await response.json();
        reason =
          errPayload?.error?.message ||
          errPayload?.error?.type ||
          reason;
      } catch {
        // Keep generic reason.
      }

      const responseBody: ChatApiResponse = {
        answer: getFallbackAnswer(role, userMessage),
        source: "fallback",
        reason,
        remainingFreeQuestions,
        dailyLimit,
        currentPlan,
      };

      return NextResponse.json(responseBody, { status: 200 });
    }

    const payload = await response.json();
    const answer = payload?.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      const responseBody: ChatApiResponse = {
        answer: getFallbackAnswer(role, userMessage),
        source: "fallback",
        reason: "Empty answer from OpenAI",
        remainingFreeQuestions,
        dailyLimit,
        currentPlan,
      };
      return NextResponse.json(responseBody, { status: 200 });
    }

    const responseBody: ChatApiResponse = {
      answer,
      source: "openai",
      remainingFreeQuestions,
      dailyLimit,
      currentPlan,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        answer:
          "I am temporarily unavailable. Please try again in a moment.",
        source: "error",
        reason: "Unhandled server exception",
        remainingFreeQuestions: 0,
        dailyLimit: Number(process.env.CHATBOT_DAILY_FREE_AI_LIMIT || 3),
        currentPlan: "free",
      },
      { status: 200 }
    );
  }
}
