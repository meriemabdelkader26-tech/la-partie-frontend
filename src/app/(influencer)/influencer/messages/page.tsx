"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Search, Send, MoreHorizontal, User, Sparkles,
  ArrowLeft, Clock, Check, CheckCheck, Info, ChevronRight,
  Smile, Paperclip
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_CONVERSATIONS, GET_CONVERSATION_MESSAGES, SEND_MESSAGE } from "@/lib/queries/messages-queries";
import { format, isToday, isYesterday } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
  };
}

interface Conversation {
  id: string;
  updatedAt: string;
  unreadCount: number;
  otherParticipant: {
    id: string;
    name: string;
    email: string;
    role: string;
    influencerProfile?: {
      profilePicture: string;
    };
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
    };
  } | null;
}

const formatMessageDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM dd");
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = searchParams.get("userId"); // For starting new chat
  const conversationIdParam = searchParams.get("conversationId");
  
  const [selectedId, setSelectedId] = useState<string | null>(conversationIdParam);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: convData, isLoading: isLoadingConvs } = useQuery({
    queryKey: ["myConversations"],
    queryFn: () => graphqlClient.request<{ myConversations: Conversation[] }>(GET_MY_CONVERSATIONS),
    refetchInterval: 10000,
  });

  const conversations = convData?.myConversations || [];

  const { data: msgData, isLoading: isLoadingMsgs } = useQuery({
    queryKey: ["conversationMessages", selectedId],
    queryFn: () => graphqlClient.request<{ conversationMessages: Message[] }>(GET_CONVERSATION_MESSAGES, { conversationId: selectedId }),
    enabled: !!selectedId,
    refetchInterval: 3000,
  });

  const messages = msgData?.conversationMessages || [];

  // Mutation
  const sendMutation = useMutation({
    mutationFn: (variables: { content: string; conversationId?: string; receiverId?: string }) => 
      graphqlClient.request(SEND_MESSAGE, variables),
    onSuccess: (data: any) => {
      const result = data.sendMessage;
      if (result.ok) {
        setMessageInput("");
        queryClient.invalidateQueries({ queryKey: ["conversationMessages", selectedId] });
        queryClient.invalidateQueries({ queryKey: ["myConversations"] });
        
        // If it was a new conversation, select it
        if (!selectedId && result.conversation?.id) {
          setSelectedId(result.conversation.id);
          router.replace("/influencer/messages");
        }
      } else {
        toast.error(result.error || "Failed to send message");
      }
    },
  });

  const handleSend = () => {
    if (!messageInput.trim()) return;

    if (selectedId) {
      sendMutation.mutate({ content: messageInput, conversationId: selectedId });
    } else if (userId) {
      sendMutation.mutate({ content: messageInput, receiverId: userId });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userId && !selectedId) {
      // Check if conversation already exists for this user
      const existing = conversations.find(c => c.otherParticipant.id === userId);
      if (existing) {
        setSelectedId(existing.id);
        router.replace("/influencer/messages");
      }
    }
  }, [userId, conversations, selectedId, router]);

  useEffect(() => {
    if (conversationIdParam && conversationIdParam !== selectedId) {
      setSelectedId(conversationIdParam);
    }
  }, [conversationIdParam, selectedId]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c.id === selectedId),
  [conversations, selectedId]);

  const filteredConversations = conversations.filter(c => 
    c.otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black tracking-tighter uppercase">Messages</h1>
          <p className="text-gray-400 font-bold text-sm tracking-tight">Chat with brands and managers</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Sidebar: Chat List */}
        <Card className="w-full md:w-[380px] border-2 border-black/5 rounded-[2.5rem] flex flex-col bg-white overflow-hidden shadow-soft shrink-0">
          <div className="p-6 space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-12 h-14 bg-gray-50 border-2 border-transparent focus:border-black/10 rounded-2xl transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoadingConvs ? (
              [1, 2, 3, 4].map(i => (
                <div key={`loading-conv-${i}`} className="flex gap-4 p-4 rounded-3xl bg-gray-50/50">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-full opacity-50" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all duration-300 group",
                    selectedId === conv.id 
                      ? "bg-black text-white shadow-xl scale-[1.02]" 
                      : "hover:bg-gray-50"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="size-12 rounded-xl">
                      <AvatarImage src={conv.otherParticipant.influencerProfile?.profilePicture} className="object-cover" />
                      <AvatarFallback className={cn(
                        "bg-white/10 font-bold",
                        selectedId === conv.id ? "text-white" : "text-black bg-gray-100"
                      )}>
                        {conv.otherParticipant.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 size-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="font-bold truncate text-sm uppercase tracking-tight">
                        {conv.otherParticipant.name}
                      </p>
                      <p className={cn(
                        "text-[10px] font-bold whitespace-nowrap",
                        selectedId === conv.id ? "text-white/40" : "text-gray-400"
                      )}>
                        {formatMessageDate(conv.updatedAt)}
                      </p>
                    </div>
                    <p className={cn(
                      "text-xs truncate font-medium",
                      selectedId === conv.id ? "text-white/60" : "text-gray-400"
                    )}>
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center space-y-4 opacity-40">
                <div className="size-16 rounded-3xl bg-gray-100 flex items-center justify-center">
                  <MessageSquare className="size-8" />
                </div>
                <p className="font-bold text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 border-2 border-black/5 rounded-[3rem] flex flex-col bg-white overflow-hidden shadow-soft">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 md:p-8 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-5">
                  <Avatar className="size-14 rounded-2xl shadow-soft">
                    <AvatarImage src={selectedConversation.otherParticipant.influencerProfile?.profilePicture} className="object-cover" />
                    <AvatarFallback className="bg-gray-100 text-black font-black">
                      {selectedConversation.otherParticipant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-black text-black tracking-tight uppercase">
                      {selectedConversation.otherParticipant.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active now</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="size-12 rounded-xl hover:bg-gray-50 transition-all">
                    <Info className="size-5 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar bg-gray-50/30">
                {isLoadingMsgs && messages.length === 0 ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={`loading-msg-${i}`} className={cn(
                        "flex",
                        i % 2 === 0 ? "justify-end" : "justify-start"
                      )}>
                        <Skeleton className="h-16 w-[200px] md:w-[300px] rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center mb-10">
                      <div className="px-6 py-2 bg-white/50 border border-black/5 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest shadow-sm backdrop-blur-sm">
                        Conversation started {format(new Date(selectedConversation.updatedAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender.id !== selectedConversation.otherParticipant.id;
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          key={msg.id || idx}
                          className={cn(
                            "flex items-end gap-3",
                            isMe ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          <div className={cn(
                            "max-w-[80%] md:max-w-[70%] p-5 rounded-4xl shadow-soft transition-all duration-300",
                            isMe 
                              ? "bg-black text-white rounded-br-md" 
                              : "bg-white border-2 border-black/5 text-black rounded-bl-md"
                          )}>
                            <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                            <div className={cn(
                              "flex items-center gap-1.5 mt-3",
                              isMe ? "justify-end" : "justify-start"
                            )}>
                              <p className={cn(
                                "text-[9px] font-black uppercase tracking-widest",
                                isMe ? "text-white/40" : "text-gray-400"
                              )}>
                                {format(new Date(msg.createdAt), "HH:mm")}
                              </p>
                              {isMe && <CheckCheck className="size-3 text-white/40" />}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 md:p-8 bg-white border-t border-black/5 shrink-0">
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-4xl border-2 border-transparent focus-within:border-black/5 focus-within:bg-white transition-all shadow-inner-soft">
                  <Button variant="ghost" size="icon" className="size-12 rounded-full hover:bg-white transition-all group">
                    <Paperclip className="size-5 text-gray-400 group-hover:text-black" />
                  </Button>
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1 border-none bg-transparent focus-visible:ring-0 px-2 h-12 font-medium"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="size-12 rounded-full hover:bg-white transition-all group">
                    <Smile className="size-5 text-gray-400 group-hover:text-black" />
                  </Button>
                  <Button 
                    className="size-14 rounded-full bg-black text-white hover:bg-gray-800 shadow-xl transition-all hover:scale-105 group"
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sendMutation.isPending}
                  >
                    <Send className="size-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            </>
          ) : userId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-black/5 rounded-full blur-2xl animate-pulse" />
                <div className="size-24 rounded-[2.5rem] bg-black flex items-center justify-center shadow-2xl relative">
                  <Sparkles className="size-12 text-white animate-bounce" />
                </div>
              </div>
              <div className="max-w-md space-y-4">
                <h3 className="text-3xl font-black text-black tracking-tighter uppercase">Start New Chat</h3>
                <p className="text-gray-500 font-medium">Send your first message to initiate a conversation.</p>
              </div>
              
              <div className="w-full max-w-lg p-6 bg-gray-50 rounded-[3rem] border-2 border-black/5 space-y-4">
                <textarea 
                  placeholder="Introduce yourself and describe your interest..."
                  className="w-full h-32 bg-transparent border-none focus:ring-0 p-4 font-medium resize-none"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                />
                <Button 
                  className="w-full h-16 bg-black text-white rounded-4xl font-black uppercase tracking-widest text-sm hover:bg-gray-800 transition-all shadow-xl"
                  onClick={handleSend}
                  disabled={!messageInput.trim() || sendMutation.isPending}
                >
                  <Send className="size-5 mr-3" />
                  Send Invitation
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="text-center max-w-md">
                <div className="size-24 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mx-auto mb-8 text-gray-200">
                  <MessageSquare className="size-12" />
                </div>
                <h3 className="text-2xl font-black text-black tracking-tighter uppercase mb-4">No Chat Selected</h3>
                <p className="text-gray-400 font-bold mb-8">Select a conversation from the sidebar to start messaging.</p>
                <Link href="/influencer/offer" className="flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-2xl shadow-xl group cursor-pointer hover:scale-105 transition-all">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={`brand-dot-${i}`} className="size-6 rounded-full bg-white/20 border-2 border-black" />
                    ))}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">Browse Brands</span>
                  <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
