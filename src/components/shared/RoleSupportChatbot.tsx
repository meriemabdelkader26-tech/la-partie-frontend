"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Bot, Loader2, MessageCircle, Minus, SendHorizonal, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/stores/use-session-store";

type RoleType = "influencer" | "brand";
type ChatMode = "free" | "plus" | "pro";

type Message = {
  id: string;
  from: "assistant" | "user";
  text: string;
};

type PageContext = {
  path: string;
  headings: string[];
  quickStats: string[];
  queryCache: Array<{
    key: string;
    summary: string;
  }>;
};

interface Props {
  role: RoleType;
}

const INFLUENCER_GUIDES = [
  "How to optimize my profile?",
  "How to apply to campaigns?",
  "How to improve engagement rate?",
  "How to receive payments faster?",
];

const BRAND_GUIDES = [
  "How to create a high converting campaign?",
  "How to select the best influencers?",
  "How to review applications quickly?",
  "How to monitor campaign ROI?",
];

const fallbackReply = (role: RoleType): string => {
  if (role === "influencer") {
    return "I can help you with profile optimization, campaign applications, content strategy, and payout best practices. Ask me one specific question for a precise step-by-step answer.";
  }
  return "I can help with campaign brief quality, influencer selection, application review workflow, and ROI metrics. Ask me one specific business question for an actionable answer.";
};

const compactData = (value: unknown, depth = 0): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (depth >= 2) {
    if (Array.isArray(value)) {
      return `[Array(${value.length})]`;
    }
    if (typeof value === "object") {
      return "[Object]";
    }
    return value;
  }

  if (Array.isArray(value)) {
    return {
      type: "array",
      length: value.length,
      sample: value.slice(0, 2).map((item) => compactData(item, depth + 1)),
    };
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const preferredKeys = [
      "id",
      "name",
      "title",
      "status",
      "totalCount",
      "pendingCount",
      "approvedCount",
      "rejectedCount",
      "followersTotaux",
      "engagementMoyenGlobal",
      "pseudo",
      "instagramUsername",
      "user",
      "offer",
      "allOffers",
      "allInfluencers",
      "allCategories",
      "allOfferApplications",
      "myInfluencerProfile",
      "myCompanyProfile",
      "companyDashboardStats",
    ];

    const selected = entries
      .sort((a, b) => {
        const ai = preferredKeys.indexOf(a[0]);
        const bi = preferredKeys.indexOf(b[0]);
        const aRank = ai === -1 ? 999 : ai;
        const bRank = bi === -1 ? 999 : bi;
        return aRank - bRank;
      })
      .slice(0, 10);

    return Object.fromEntries(
      selected.map(([key, val]) => [key, compactData(val, depth + 1)])
    );
  }

  return value;
};

const toSummary = (value: unknown): string => {
  try {
    const compact = compactData(value);
    const serialized = JSON.stringify(compact);
    return serialized.length > 800 ? `${serialized.slice(0, 800)}...` : serialized;
  } catch {
    return "[unserializable]";
  }
};

const RoleSupportChatbot = ({ role }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const currentUser = useSessionStore((state) => state.currentUser);

  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [input, setInput] = useState("");
  const [chatMode, setChatMode] = useState<ChatMode>("free");
  const [lastSource, setLastSource] = useState<"openai" | "fallback" | "error" | null>(null);
  const [lastReason, setLastReason] = useState<string>("");
  const [remainingFreeQuestions, setRemainingFreeQuestions] = useState<number>(3);
  const [dailyLimit, setDailyLimit] = useState<number>(3);
  const [currentPlan, setCurrentPlan] = useState<ChatMode>("free");
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const initialGreeting = useMemo(() => {
    return role === "influencer"
      ? "Hi, I am your Influencer Assistant. I can answer your questions and guide you step-by-step."
      : "Hi, I am your Brand Assistant. I can help you run better campaigns and make faster decisions.";
  }, [role]);

  const storageKey = useMemo(() => {
    const userId = currentUser?.id || "anonymous";
    return `role-chat:${role}:${userId}`;
  }, [role, currentUser?.id]);

  const modeStorageKey = useMemo(() => {
    const userId = currentUser?.id || "anonymous";
    return `role-chat-mode:${role}:${userId}`;
  }, [role, currentUser?.id]);

  const [messages, setMessages] = useState<Message[]>([
    { id: "m-1", from: "assistant", text: initialGreeting },
  ]);

  const messageCounter = useRef(2);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      setMessages([{ id: "m-1", from: "assistant", text: initialGreeting }]);
      messageCounter.current = 2;
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Message[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
        messageCounter.current = parsed.length + 2;
        return;
      }
    } catch {
      // Ignore corrupted history and reset.
    }

    setMessages([{ id: "m-1", from: "assistant", text: initialGreeting }]);
    messageCounter.current = 2;
  }, [storageKey, initialGreeting]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedMode = window.localStorage.getItem(modeStorageKey);
    if (savedMode === "free" || savedMode === "plus" || savedMode === "pro") {
      setChatMode(savedMode);
    }
  }, [modeStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(modeStorageKey, chatMode);
  }, [chatMode, modeStorageKey]);

  const quickGuides = role === "influencer" ? INFLUENCER_GUIDES : BRAND_GUIDES;
  const botName = role === "influencer" ? "Influencer AI" : "Brand AI";
  const logoUrl = process.env.NEXT_PUBLIC_CHATBOT_LOGO_URL || "";
  const minimizedButtonText = process.env.NEXT_PUBLIC_CHATBOT_MINIMIZED_BUTTON_TEXT || "Chat Now";
  const plusPrice = process.env.NEXT_PUBLIC_CHATBOT_PLUS_PRICE || "12";
  const proPrice = process.env.NEXT_PUBLIC_CHATBOT_PRO_PRICE || "25";

  const refreshBillingStatus = useCallback(async () => {
    const params = new URLSearchParams();
    if (currentUser?.id) {
      params.set("userId", currentUser.id);
    }
    if (currentUser?.email) {
      params.set("email", currentUser.email);
    }

    const response = await fetch(`/api/chatbot-billing?${params.toString()}`);
    const payload = (await response.json()) as {
      currentPlan?: ChatMode;
    };

    const plan =
      payload.currentPlan === "plus" || payload.currentPlan === "pro"
        ? payload.currentPlan
        : "free";
    setCurrentPlan(plan);
  }, [currentUser?.id, currentUser?.email]);

  useEffect(() => {
    void refreshBillingStatus();
  }, [refreshBillingStatus]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const billingState = searchParams.get("chatbotBilling");
    const sessionId = searchParams.get("session_id");
    if (!billingState) {
      return;
    }

    if (billingState === "cancel") {
      setLastSource("fallback");
      setLastReason("Checkout canceled");
      const assistantMessage: Message = {
        id: `a-${messageCounter.current}`,
        from: "assistant",
        text: "Checkout canceled. You can continue in Free mode, or upgrade to Plus/Pro when you are ready.",
      };
      messageCounter.current += 1;
      setMessages((prev) => [...prev, assistantMessage]);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      return;
    }

    if (billingState !== "success" || !sessionId) {
      return;
    }

    const confirmCheckout = async () => {
      setIsBillingLoading(true);
      try {
        const response = await fetch("/api/chatbot-billing/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            userId: currentUser?.id || null,
            email: currentUser?.email || null,
          }),
        });

        const payload = (await response.json()) as {
          currentPlan?: ChatMode;
          message?: string;
        };

        if (response.ok) {
          const plan =
            payload.currentPlan === "plus" || payload.currentPlan === "pro"
              ? payload.currentPlan
              : "free";
          setCurrentPlan(plan);
          setChatMode(plan);
          setLastSource("openai");
          setLastReason("Subscription activated");
        } else {
          setLastSource("error");
          setLastReason(payload.message || "Unable to confirm payment");
        }
      } catch {
        setLastSource("error");
        setLastReason("Unable to confirm payment");
      } finally {
        setIsBillingLoading(false);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
        void refreshBillingStatus();
      }
    };

    void confirmCheckout();
  }, [searchParams, currentUser?.id, currentUser?.email, refreshBillingStatus]);

  const startCheckout = async (plan: "plus" | "pro") => {
    setIsBillingLoading(true);
    try {
      const response = await fetch("/api/chatbot-billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: currentUser?.id || null,
          email: currentUser?.email || null,
          returnPath: pathname || "/",
        }),
      });

      const payload = (await response.json()) as {
        checkoutUrl?: string;
        message?: string;
      };

      if (!response.ok || !payload.checkoutUrl) {
        setLastSource("error");
        setLastReason(payload.message || "Unable to start checkout");
        return;
      }

      window.location.href = payload.checkoutUrl;
    } catch {
      setLastSource("error");
      setLastReason("Unable to start checkout");
    } finally {
      setIsBillingLoading(false);
    }
  };

  const collectPageContext = (): PageContext => {
    const path = pathname || "/";

    const headings =
      typeof window !== "undefined"
        ? Array.from(document.querySelectorAll("h1, h2"))
            .map((el) => el.textContent?.trim() || "")
            .filter(Boolean)
            .slice(0, 6)
        : [];

    const quickStats =
      typeof window !== "undefined"
        ? Array.from(document.querySelectorAll("[data-slot='card-title'], [class*='text-3xl']"))
            .map((el) => el.textContent?.replace(/\s+/g, " ").trim() || "")
            .filter((txt) => txt.length > 0 && txt.length < 60)
            .slice(0, 10)
        : [];

    const routeTokens = path
      .split("/")
      .filter(Boolean)
      .map((p) => p.toLowerCase());

    const domainTokens =
      role === "influencer"
        ? ["influencer", "campaign", "offer", "application", "profile", "earnings", "analytics"]
        : ["company", "campaign", "offer", "application", "dashboard", "profile", "influencer"];

    const allQueries = queryClient.getQueryCache().getAll();
    const relevant = allQueries
      .map((query) => {
        const queryKey = Array.isArray(query.queryKey) ? query.queryKey : [query.queryKey];
        const keyText = queryKey.join(" ").toLowerCase();
        const isRelevant = [...routeTokens, ...domainTokens].some((token) =>
          keyText.includes(token)
        );
        if (!isRelevant) {
          return null;
        }
        return {
          key: JSON.stringify(query.queryKey),
          summary: toSummary(query.state.data),
        };
      })
      .filter((item): item is { key: string; summary: string } => Boolean(item))
      .slice(0, 6);

    return {
      path,
      headings,
      quickStats,
      queryCache: relevant,
    };
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: Message = {
      id: `u-${messageCounter.current}`,
      from: "user",
      text: trimmed,
    };
    messageCounter.current += 1;

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setIsSending(true);

    try {
      const pageContext = collectPageContext();

      const response = await fetch("/api/role-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          mode: chatMode,
          pagePath: pathname || "/",
          userId: currentUser?.id || null,
          email: currentUser?.email || null,
          userMessage: trimmed,
          history: nextHistory.slice(-14).map((msg) => ({
            from: msg.from,
            text: msg.text,
          })),
          pageContext,
        }),
      });

      const payload = (await response.json()) as {
        answer?: string;
        source?: "openai" | "fallback" | "error";
        reason?: string;
        remainingFreeQuestions?: number;
        dailyLimit?: number;
        currentPlan?: ChatMode;
      };
      const answer = payload.answer?.trim() || fallbackReply(role);
      const source = payload.source || "fallback";
      setLastSource(source);
      setLastReason(payload.reason || "");
      setRemainingFreeQuestions(
        typeof payload.remainingFreeQuestions === "number"
          ? payload.remainingFreeQuestions
          : remainingFreeQuestions
      );
      setDailyLimit(typeof payload.dailyLimit === "number" ? payload.dailyLimit : dailyLimit);
      if (payload.currentPlan === "plus" || payload.currentPlan === "pro" || payload.currentPlan === "free") {
        setCurrentPlan(payload.currentPlan);
      }

      const assistantMessage: Message = {
        id: `a-${messageCounter.current}`,
        from: "assistant",
        text: answer,
      };
      messageCounter.current += 1;

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setLastSource("error");
      setLastReason("Client request failed");
      const assistantMessage: Message = {
        id: `a-${messageCounter.current}`,
        from: "assistant",
        text: fallbackReply(role),
      };
      messageCounter.current += 1;
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void sendMessage(input);
  };

  if (!isOpen) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[80] rounded-2xl bg-sky-500 px-6 py-3 text-white shadow-lg transition hover:bg-sky-600"
      >
        {minimizedButtonText}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-[80] h-[640px] w-[330px] rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
        <div className="flex items-center gap-2">
          {logoUrl && !logoError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="chatbot-logo"
              className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
              <Bot className="h-4 w-4" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">{botName}</p>
            <div className="flex items-center gap-2">
              <p className="text-[11px] text-emerald-600">Online</p>
              {chatMode === "free" && (
                <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-medium text-sky-700">
                  Free {remainingFreeQuestions}/{dailyLimit}
                </span>
              )}
              {(currentPlan === "plus" || currentPlan === "pro") && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                  {currentPlan === "pro" ? "Pro Active" : "Plus Active"}
                </span>
              )}
              {lastSource === "openai" && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                  AI Live
                </span>
              )}
              {lastSource === "fallback" && (
                <span
                  className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700"
                  title={lastReason || "Fallback response"}
                >
                  Fallback
                </span>
              )}
              {lastSource === "error" && (
                <span
                  className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-700"
                  title={lastReason || "API error"}
                >
                  Retry
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Minimize chatbot"
            title="Minimize"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close chatbot"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="h-[470px] overflow-y-auto px-3 py-3">
        <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-xs font-medium text-slate-700">Mode</p>
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChatMode("free")}
              className={cn(
                "rounded-full border px-2 py-1 text-[11px]",
                chatMode === "free"
                  ? "border-slate-700 bg-slate-700 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              )}
            >
              Free (3/day)
            </button>
            <button
              type="button"
              onClick={() => setChatMode("plus")}
              className={cn(
                "rounded-full border px-2 py-1 text-[11px]",
                chatMode === "plus"
                  ? "border-sky-600 bg-sky-600 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              )}
            >
              Plus (${plusPrice})
            </button>
            <button
              type="button"
              onClick={() => setChatMode("pro")}
              className={cn(
                "rounded-full border px-2 py-1 text-[11px]",
                chatMode === "pro"
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-300 bg-white text-slate-700"
              )}
            >
              Pro (${proPrice})
            </button>
          </div>
          {(chatMode === "plus" || chatMode === "pro") &&
            !(
              (chatMode === "plus" && (currentPlan === "plus" || currentPlan === "pro")) ||
              (chatMode === "pro" && currentPlan === "pro")
            ) && (
              <button
                type="button"
                onClick={() => {
                  void startCheckout(chatMode === "pro" ? "pro" : "plus");
                }}
                className="mb-3 w-full rounded-xl bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isBillingLoading}
              >
                {isBillingLoading
                  ? "Redirecting to secure checkout..."
                  : `Upgrade to ${chatMode === "pro" ? `Pro ($${proPrice}/month)` : `Plus ($${plusPrice}/month)`}`}
              </button>
            )}
          <p className="text-xs font-medium text-slate-700">Quick guides</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickGuides.map((guide) => (
              <button
                key={guide}
                onClick={() => {
                  void sendMessage(guide);
                }}
                className="rounded-full border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 hover:border-sky-400 hover:text-sky-700"
                disabled={isSending}
              >
                {guide}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex", message.from === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  message.from === "user"
                    ? "bg-sky-500 text-white"
                    : "bg-slate-100 text-slate-800"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="border-t border-slate-200 px-3 py-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2">
          <MessageCircle className="h-4 w-4 text-slate-400" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here and send"
            className="h-8 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            disabled={isSending}
          />
          <button
            type="submit"
            className="rounded-full bg-sky-500 p-2 text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Send message"
            disabled={isSending}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleSupportChatbot;
