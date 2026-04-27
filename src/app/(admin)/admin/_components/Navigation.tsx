"use client";

import { Layout, Users, Tags, ShieldUser, MessageSquare } from "lucide-react";

import { SidebarItem } from "./SidebarItem";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { GET_MY_NOTIFICATIONS } from "@/lib/queries/messages-queries";



const routes = [

  {

    icon: Layout,

    label: "Dashboard",

    href: "/admin",

  },

  {

    icon: Tags,

    label: "Category",

    href: "/admin/category",

  },



  {

    icon: Users,

    label: "Users",

    href: "/admin/user",

  },

  // {

  //   icon: HandCoins,

  //   label: "Influencers",

  //   href: "/admin/influencer",

  // },

  {

    label: "Offers",

    icon: Tags,

    href: "/admin/offer",

  },

  {

    label: "Influencers",

    icon: ShieldUser,

    href: "/admin/influencer",

  },

  {

    label: "Messages",

    icon: MessageSquare,

    href: "/admin/chat",

  },

];



const SidebarRoutes = () => {
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

  const unreadNotifications = notifications?.filter((n) => !n.isRead) || [];
  
  const userNotificationsCount = unreadNotifications.filter(
    (n) => n.title.toLowerCase().includes("user") || n.link.includes("/admin/user")
  ).length;
  
  const offerNotificationsCount = unreadNotifications.filter(
    (n) => 
      n.title.toLowerCase().includes("campaign") || 
      n.title.toLowerCase().includes("offer") || 
      n.title.toLowerCase().includes("application") ||
      n.link.includes("/admin/offer")
  ).length;

  const chatNotificationsCount = unreadNotifications.filter(
    (n) => n.title.toLowerCase().includes("message") || n.link.includes("/admin/chat")
  ).length;

  return (

    <div className="flex flex-col w-full py-6 px-2">

      {routes.map((route) => (

        <SidebarItem

          key={route.href}

          icon={route.icon}

          label={route.label}

          href={route.href}
          notificationCount={
            route.label === "Users" ? userNotificationsCount :
            route.label === "Offers" ? offerNotificationsCount :
            route.label === "Messages" ? chatNotificationsCount :
            undefined
          }

        />

      ))}

    </div>

  );

};



export default SidebarRoutes;