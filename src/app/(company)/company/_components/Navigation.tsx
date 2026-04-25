"use client";
import {
  Layout,
  Briefcase,
  BarChart3,
  MessageSquare,
  Settings,
  Search,
  Building2,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_CONVERSATIONS } from "@/lib/queries/messages-queries";

const routes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/company/dashboard",
  },
  {
    icon: Search,
    label: "Recherche Influenceurs",
    href: "/company/influencers/search",
  },
  {
    icon: Briefcase,
    label: "Mes Offres",
    href: "/company/campaigns",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    href: "/company/analytics",
  },
  {
    icon: MessageSquare,
    label: "Messages",
    href: "/company/messages",
  },
  {
    icon: Building2,
    label: "Profil",
    href: "/company/profile",
  },
  {
    icon: Settings,
    label: "Paramètres",
    href: "/company/settings",
  },
];

const Navigation = () => {
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

  return (
    <div className="flex flex-col w-full h-12 py-4">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          notificationCount={
            route.label === "Messages" ? unreadMessagesCount : 
            route.label === "Mes Offres" ? unreadApplicationsCount :
            undefined
          }
        />
      ))}
    </div>
  );
};

export default Navigation;
