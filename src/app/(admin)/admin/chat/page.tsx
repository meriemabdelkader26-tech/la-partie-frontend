"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send, 
  Info,
  ChevronRight,
  Sparkles,
  User as UserIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { 
  GET_MY_CONVERSATIONS, 
  GET_CONVERSATION_MESSAGES, 
  SEND_MESSAGE 
} from "@/lib/queries/messages-queries";
import { format, isToday, isYesterday } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  influencerProfile?: {
    profilePicture?: string;
  };
}

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
  otherParticipant: Participant;
  lastMessage?: Message;
}

const formatMessageDate = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d");
};

const GET_USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      influencerProfile {
        profilePicture
      }
    }
  }
`;

export default function AdminChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = searchParams.get("userId");
  const conversationIdParam = searchParams.get("conversationId");
  
  const [selectedId, setSelectedId] = useState<string | null>(conversationIdParam);
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch recipient user details if userId is provided
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => graphqlClient.request<{ user: Participant }>(GET_USER_QUERY, { id: userId || "" }),
    enabled: !!userId && !selectedId,
  });

  const recipientUser = userData?.user;

  // Fetch all conversations
  const { data: convData, isLoading: isLoadingConvs } = useQuery({
    queryKey: ["myConversations"],
    queryFn: () => graphqlClient.request<{ myConversations: Conversation[] }>(GET_MY_CONVERSATIONS),
    refetchInterval: 10000,
  });

  const conversations = convData?.myConversations || [];

  // Fetch messages for selected conversation
  const { data: msgData, isLoading: isLoadingMsgs } = useQuery({
    queryKey: ["conversationMessages", selectedId],
    queryFn: () => {
        if (!selectedId) return { conversationMessages: [] };
        return graphqlClient.request<{ conversationMessages: Message[] }>(GET_CONVERSATION_MESSAGES, { conversationId: selectedId });
    },
    enabled: !!selectedId,
    refetchInterval: 3000,
  });

  const messages = msgData?.conversationMessages || [];

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (variables: { content: string; conversationId?: string; receiverId?: string }) =>
      graphqlClient.request(SEND_MESSAGE, variables),
    onSuccess: (data: any) => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["conversationMessages", selectedId] });
      queryClient.invalidateQueries({ queryKey: ["myConversations"] });
      
      if (!selectedId && data?.sendMessage?.conversation?.id) {
        setSelectedId(data.sendMessage.conversation.id);
        router.replace("/admin/chat");
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to send message");
    }
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
    if (conversationIdParam) {
      setSelectedId(conversationIdParam);
    } else if (userId && conversations.length > 0) {
      const existingConv = conversations.find(c => c.otherParticipant.id === userId);
      if (existingConv) {
        setSelectedId(existingConv.id);
      }
    }
  }, [userId, conversationIdParam, conversations]);

  const selectedConversation = useMemo(() => 
    conversations.find(c => c.id === selectedId),
  [conversations, selectedId]);

  const filteredConversations = conversations.filter(c => 
    c.otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between px-2 shrink-0">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
            <MessageSquare className="w-3 h-3 text-emerald-400" />
            <span>Admin Messaging</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tighter">
            User <span className="text-gray-400">Support</span> 💬
          </h1>
        </motion.div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        {/* Sidebar - Chat List */}
        <Card className="w-full md:w-[380px] bg-white border-black/5 rounded-[2.5rem] shadow-soft overflow-hidden flex flex-col shrink-0">
          <div className="p-6 border-b border-black/5">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <Input 
                placeholder="Search conversations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-12 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 font-bold rounded-2xl transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {isLoadingConvs ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton className="size-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <div 
                  key={conv.id} 
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "p-4 rounded-3xl flex items-center gap-4 cursor-pointer transition-all duration-300",
                    selectedId === conv.id 
                      ? 'bg-black text-white shadow-xl scale-[1.02]' 
                      : 'hover:bg-gray-50'
                  )}
                >
                  <Avatar className="size-12 rounded-xl">
                    <AvatarImage src={conv.otherParticipant.influencerProfile?.profilePicture} className="object-cover" />
                    <AvatarFallback className={cn("rounded-xl font-black", selectedId === conv.id ? "bg-white/20 text-white" : "bg-gray-100 text-black")}>
                      {conv.otherParticipant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-black text-sm truncate uppercase tracking-tight">
                        {conv.otherParticipant.name}
                      </h4>
                      {conv.lastMessage && (
                        <span className={cn("text-[9px] font-black uppercase", selectedId === conv.id ? "text-white/60" : "text-gray-400")}>
                          {formatMessageDate(conv.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "text-xs truncate font-medium",
                        selectedId === conv.id ? "text-white/70" : "text-gray-500",
                        conv.unreadCount > 0 && selectedId !== conv.id && "font-black text-black"
                      )}>
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                      {conv.unreadCount > 0 && selectedId !== conv.id && (
                        <div className="size-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">
                          {conv.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center opacity-40">
                <MessageSquare className="size-10 mb-4" />
                <p className="font-black text-xs uppercase tracking-widest">No conversations</p>
              </div>
            )}
          </div>
        </Card>

        {/* Main Chat Area */}
        <Card className="flex-1 bg-white border-black/5 rounded-[3rem] shadow-large overflow-hidden flex flex-col relative min-w-0">
          <div className="absolute inset-0 bg-gray-50/30 -z-10" />

          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-6 md:p-8 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <Avatar className="size-14 rounded-2xl shadow-soft">
                    <AvatarImage src={selectedConversation.otherParticipant.influencerProfile?.profilePicture} className="object-cover" />
                    <AvatarFallback className="bg-black text-white font-black text-lg">
                      {selectedConversation.otherParticipant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-black text-black uppercase tracking-tighter">{selectedConversation.otherParticipant.name}</h3>
                    <div className="flex items-center gap-2">
                      <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="size-12 rounded-xl hover:bg-gray-50 transition-all">
                    <Info className="size-5 text-gray-400" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 custom-scrollbar">
                {isLoadingMsgs && messages.length === 0 ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                      <div key={`loading-msg-${i}`} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
                        <Skeleton className="h-12 w-1/3 rounded-2xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="text-center pb-8">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-black/5">Conversation started</span>
                    </div>
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender.id !== selectedConversation.otherParticipant.id;
                      return (
                        <motion.div
                          key={msg.id || idx}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
                        >
                          <div className={cn(
                            "px-6 py-4 rounded-[1.8rem] text-sm font-medium shadow-soft",
                            isMe 
                              ? "bg-black text-white rounded-tr-none" 
                              : "bg-white text-black border border-black/5 rounded-tl-none"
                          )}>
                            {msg.content}
                          </div>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5 px-2">
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </span>
                        </motion.div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-6 md:p-8 bg-white/80 backdrop-blur-md border-t border-black/5 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative group">
                    <Input 
                      placeholder="Type your message..." 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-14 pl-6 bg-gray-50 border-transparent focus:bg-white focus:border-black/10 text-black font-bold rounded-2xl transition-all shadow-inner"
                    />
                  </div>
                  <Button 
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sendMutation.isPending}
                    className={cn(
                      "size-14 rounded-2xl shrink-0 shadow-large transition-all duration-300",
                      messageInput.trim() ? "bg-black text-white hover:scale-105" : "bg-gray-100 text-gray-300"
                    )}
                  >
                    <Send className="size-6" />
                  </Button>
                </div>
              </div>
            </>
          ) : userId ? (
             <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
                {isLoadingUser ? (
                  <div className="flex flex-col items-center gap-4">
                    <Skeleton className="size-24 rounded-[2.5rem]" />
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Avatar className="size-24 rounded-[2.5rem] shadow-2xl">
                        <AvatarImage src={recipientUser?.influencerProfile?.profilePicture} className="object-cover" />
                        <AvatarFallback className="bg-black text-white text-3xl font-black">
                          {recipientUser?.name?.substring(0, 2).toUpperCase() || <UserIcon className="size-10" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-2xl border-4 border-white">
                        <Plus className="size-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-3xl font-black text-black tracking-tighter uppercase">
                        Chat with {recipientUser?.name || "User"}
                      </h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                          {recipientUser?.role || "USER"}
                        </span>
                        <span className="text-gray-400 font-medium text-xs">•</span>
                        <span className="text-gray-400 font-medium text-xs">{recipientUser?.email}</span>
                      </div>
                      <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed pt-2">
                        You're starting a new support conversation. Write your first message below to begin.
                      </p>
                    </div>
                  </>
                )}

                <div className="w-full max-w-md bg-white p-2 rounded-3xl border border-black/5 shadow-large flex items-center gap-2 mt-4">
                   <Input 
                      placeholder={recipientUser ? `Message ${recipientUser.name}...` : "Write a message..."} 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      className="h-14 border-none shadow-none focus-visible:ring-0 font-bold"
                   />
                   <Button 
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sendMutation.isPending || isLoadingUser}
                    className="size-14 rounded-2xl bg-black text-white shrink-0 hover:scale-105 transition-transform"
                   >
                    <Send className="size-6" />
                   </Button>
                </div>
             </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="text-center max-w-md">
                <div className="size-32 bg-gray-50 rounded-[2.5rem] inline-flex items-center justify-center mb-8 border border-black/5 relative">
                  <MessageSquare className="size-12 text-gray-300" />
                  <Sparkles className="absolute -top-4 -right-4 size-10 text-yellow-400 animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-black tracking-tighter mb-4">Messaging Center</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                  Select a user from the sidebar to start a conversation.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
