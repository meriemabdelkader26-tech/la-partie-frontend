"use client";

import React, { useState } from "react";
import { Bell, MessageSquare, Briefcase, DollarSign, Info, CheckCircle2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_NOTIFICATIONS, MARK_ALL_NOTIFICATIONS_READ } from "@/lib/queries/messages-queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  notificationType: string;
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

const getNotificationIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "message":
      return <MessageSquare className="w-4 h-4 text-blue-500" />;
    case "application":
      return <Briefcase className="w-4 h-4 text-purple-500" />;
    case "payout":
      return <DollarSign className="w-4 h-4 text-green-500" />;
    case "system":
      return <Info className="w-4 h-4 text-amber-500" />;
    default:
      return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

export default function NotificationsDropdown() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myNotifications: Notification[] }>(
        GET_MY_NOTIFICATIONS,
        { first: 20 }
      );
      return response.myNotifications;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markReadMutation = useMutation({
    mutationFn: async () => {
      return await graphqlClient.request(MARK_ALL_NOTIFICATIONS_READ);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const notifications = data || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markReadMutation.mutate();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2.5 rounded-2xl bg-gray-50 border border-black/5 hover:bg-black hover:text-white transition-all duration-300 group">
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-black border-2 border-white rounded-full group-hover:bg-white animate-pulse"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 md:w-96 bg-white border-2 border-black/5 rounded-3xl p-2 shadow-large mt-2 animate-fadeInUp"
        align="end"
      >
        <div className="flex items-center justify-between p-4">
          <DropdownMenuLabel className="p-0 font-black text-lg tracking-tight">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-bold bg-black text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-gray-400 hover:text-black transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Mark all as read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-black/5 mx-2" />
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 gap-3">
              <div className="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-400">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col gap-1 p-2">
              {notifications.map((notification) => (
                <Link 
                  key={notification.id} 
                  href={notification.link || "#"}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex gap-4 p-4 rounded-2xl transition-all duration-300 group hover:bg-gray-50",
                    !notification.isRead && "bg-gray-50/50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-soft transition-transform group-hover:scale-110",
                    !notification.isRead ? "bg-white border-2 border-black" : "bg-gray-100"
                  )}>
                    {getNotificationIcon(notification.notificationType)}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className={cn(
                      "text-sm tracking-tight leading-tight line-clamp-1",
                      !notification.isRead ? "font-black text-black" : "font-bold text-gray-600"
                    )}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="ml-auto flex items-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-200" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-black text-black">All caught up!</p>
                <p className="text-sm font-medium text-gray-400">No new notifications at the moment.</p>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <DropdownMenuSeparator className="bg-black/5 mx-2" />
        <div className="p-2">
          <Link 
            href="/notifications" 
            className="w-full flex items-center justify-center p-3 rounded-xl text-sm font-black text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
            onClick={() => setIsOpen(false)}
          >
            View All Activity
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
