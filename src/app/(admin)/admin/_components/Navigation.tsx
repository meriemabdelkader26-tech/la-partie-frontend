"use client";
import { Layout, Users, Tags, ShieldUser } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

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
];

const SidebarRoutes = () => {
  return (
    <div className="flex flex-col w-full h-12 py-4">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;