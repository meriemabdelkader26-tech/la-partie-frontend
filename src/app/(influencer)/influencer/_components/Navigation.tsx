"use client";
import { Layout, User, Briefcase, Settings, Wallet, Tags, MessageSquare, Sparkles, Star } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_CONVERSATIONS } from "@/lib/queries/messages-queries";

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/influencer",
  },
  {
    icon: User,
    label: "My Profile",
    href: "/influencer/profile",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/influencer/messages",
  },
  {
    icon: Briefcase,
    label: "Applications",
    href: "/influencer/applications",
  },
  {
    icon: Sparkles,
    label: "Campaigns",
    href: "/influencer/campaigns",
  },
  {
    icon: Star,
    label: "Saved Offers",
    href: "/influencer/saved-offers",
  },
  {
    label: "Offers",
    icon: Tags,
    href: "/influencer/offer",
  },
  {
    icon: Wallet,
    label: "Earnings",
    href: "/influencer/earnings",
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/influencer/settings",
  },
];

const Navigation = ({ idPrefix = "desktop" }: { idPrefix?: string }) => {
  const { data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myConversations: any[] }>(
        GET_MY_CONVERSATIONS
      );
      return response.myConversations;
    },
    refetchInterval: 30000,
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await graphqlClient.request<{ myNotifications: any[] }>(
        GET_MY_NOTIFICATIONS,
        { first: 50 }
      );
      return response.myNotifications;
    },
    refetchInterval: 30000,
  });

  const unreadMessagesCount = conversations?.reduce(
    (acc, conv) => acc + (conv.unreadCount || 0),
    0
  );

  const unreadApplicationsCount = notifications?.filter(
    (n) => n.notificationType === "application" && !n.isRead
  ).length;

  const savedOffersCount = notifications?.filter(
    (n) => n.notificationType === "system" && n.title.toLowerCase().includes("saved") && !n.isRead
  ).length; // This is a placeholder, usually we might want total saved count if it were a notification

  return (
    <div className="flex flex-col w-full h-12 py-4">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          idPrefix={idPrefix}
          notificationCount={
            route.label === "Messages" ? unreadMessagesCount : 
            route.label === "Applications" ? unreadApplicationsCount :
            undefined
          }
        />
      ))}
    </div>
  );
};

export default Navigation;
