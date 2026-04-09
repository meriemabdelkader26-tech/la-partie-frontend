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
