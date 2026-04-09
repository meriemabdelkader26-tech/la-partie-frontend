"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, MoreVertical, Paperclip, Smile } from "lucide-react";
import { useState } from "react";

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = useState(1);

  const conversations = [
    {
      id: 1,
      name: "StyleBrand Co.",
      lastMessage: "Looking forward to the collaboration!",
      time: "10:30 AM",
      unread: 2,
      avatar: "SB",
    },
    {
      id: 2,
      name: "TechHub Inc.",
      lastMessage: "Can you send the draft by tomorrow?",
      time: "Yesterday",
      unread: 0,
      avatar: "TH",
    },
    {
      id: 3,
      name: "FashionForward",
      lastMessage: "Thank you for the amazing work!",
      time: "2 days ago",
      unread: 0,
      avatar: "FF",
    },
    {
      id: 4,
      name: "GlowBeauty",
      lastMessage: "We have a new campaign opportunity",
      time: "3 days ago",
      unread: 1,
      avatar: "GB",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "them",
      content:
        "Hi! We're interested in collaborating with you on our summer collection.",
      time: "9:45 AM",
    },
    {
      id: 2,
      sender: "me",
      content: "That sounds great! I'd love to hear more about it.",
      time: "9:50 AM",
    },
    {
      id: 3,
      sender: "them",
      content:
        "Perfect! We're looking for 3 Instagram posts and 2 stories. The budget is $2,500.",
      time: "10:15 AM",
    },
    {
      id: 4,
      sender: "me",
      content: "That works for me! When would you need this completed by?",
      time: "10:20 AM",
    },
    {
      id: 5,
      sender: "them",
      content: "Looking forward to the collaboration!",
      time: "10:30 AM",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 mt-1">
          Communicate with brands and manage collaborations
        </p>
      </div>

      <Card className="bg-slate-800/50 border-slate-700 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r border-slate-700 flex flex-col">
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation.id)}
                  className={`w-full p-4 border-b border-slate-700 hover:bg-slate-700/50 transition-colors text-left ${
                    selectedChat === conversation.id ? "bg-slate-700/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {conversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-medium truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-slate-400">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-400 truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="bg-emerald-600 text-white border-0 ml-2">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 hidden md:flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-emerald-600 text-white">
                    SB
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-medium">StyleBrand Co.</h3>
                  <p className="text-xs text-slate-400">Active now</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === "me"
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-700 text-white"
                    } rounded-lg p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "me"
                          ? "text-emerald-100"
                          : "text-slate-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-slate-700 border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-slate-400 hover:text-white"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MessagesPage;
