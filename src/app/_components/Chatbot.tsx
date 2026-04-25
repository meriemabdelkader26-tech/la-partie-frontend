"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  X, 
  Send, 
  User, 
  Sparkles, 
  Minus,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/stores/use-session-store";
import { graphqlClient } from "@/lib/graphql-client";
import { ASK_CHATBOT_MUTATION } from "@/lib/queries/chatbot-queries";
import { useMutation } from "@tanstack/react-query";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

export const Chatbot = () => {
  const { currentUser } = useSessionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const chatbotMutation = useMutation({
    mutationFn: async ({ question, role }: { question: string; role?: string }) => {
      const response = await graphqlClient.request<any>(ASK_CHATBOT_MUTATION, {
        question,
        role,
      });
      return response.askChatbot;
    },
    onSuccess: (data) => {
      const botMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: (error) => {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  useEffect(() => {
    const userName = currentUser?.name || "there";
    setMessages([
      {
        id: "1",
        role: "bot",
        content: `Hi ${userName}! How can I help you with InfluBridge today?`,
        timestamp: new Date(),
      },
    ]);
  }, [currentUser]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInputValue("");

    // Use RAG mutation from backend
    chatbotMutation.mutate({
      question: messageText,
      role: currentUser?.role || undefined,
    });
  };

  const suggestedQuestions = {
    INFLUENCER: [
      "How to find campaigns?",
      "When is payout?",
      "Profile tips",
      "Message brand",
    ],
    COMPANY: [
      "Start campaign",
      "Top influencers?",
      "Payment security",
      "Review apps",
    ],
    DEFAULT: [
      "How it works?",
      "Platform fees",
      "Support team",
    ],
  };

  const currentQuestions = suggestedQuestions[currentUser?.role as keyof typeof suggestedQuestions] || suggestedQuestions.DEFAULT;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="mb-4 w-[380px] h-[520px] bg-white border-2 border-black rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm tracking-tight">InfluBridge Support</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/10 h-8 w-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10, y: 5 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === "user" ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-4 py-3 rounded-[1.25rem] text-sm font-medium leading-relaxed shadow-sm",
                      msg.role === "user"
                        ? "bg-black text-white rounded-br-none"
                        : "bg-gray-100 text-black rounded-bl-none border border-gray-200"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              ))}

              {/* Suggested Questions Pill Display */}
              {messages.length === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 pt-2"
                >
                  {currentQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-4 py-2 rounded-full border border-black/10 bg-white text-xs font-bold text-black hover:bg-black hover:text-white transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Loading Indicator */}
            {chatbotMutation.isPending && (
              <div className="px-6 pb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1"
                >
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </motion.div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-gray-50 border-t-2 border-black/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  disabled={chatbotMutation.isPending}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white border-2 border-black/10 rounded-2xl py-3 px-4 pr-12 text-sm font-medium focus:outline-none focus:border-black transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || chatbotMutation.isPending}
                  className="absolute right-2 p-2 bg-black text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">
                Powered by InfluBridge
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-300",
          isOpen ? "bg-black rotate-90" : "bg-black"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
            >
              <X className="w-8 h-8 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative"
            >
              <MessageSquare className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white border-2 border-black rounded-full flex items-center justify-center animate-bounce">
                 <div className="w-1.5 h-1.5 rounded-full bg-black" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
