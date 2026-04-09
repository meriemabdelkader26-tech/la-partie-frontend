"use client";
import { Layout, User, Briefcase, Settings, Wallet, Tags } from "lucide-react";
import { SidebarItem } from "./SidebarItem";

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
    icon: Briefcase,
    label: "Campaigns",
    href: "/influencer/campaigns",
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

const Navigation = () => {
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

export default Navigation;
