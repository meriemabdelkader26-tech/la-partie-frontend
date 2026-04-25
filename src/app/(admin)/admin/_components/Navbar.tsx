"use client";

import { useSessionStore } from "@/stores/use-session-store";
import AvatarDropdown from "./AvatarDropdown";
import NotificationsDropdown from "@/app/_components/NotificationsDropdown";
import { APP_NAME } from "@/constant";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  const { currentUser } = useSessionStore();

  return (
    <nav className="w-full flex items-center justify-between px-8 h-16 bg-white">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-11 pl-12 pr-4 bg-gray-50 border-2 border-black/5 rounded-xl text-black placeholder:text-gray-400 focus:border-black focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Dropdown */}
        <AvatarDropdown email={currentUser?.email || ""} name={currentUser?.name || "User"} />
      </div>
    </nav>
  );
};

export default Navbar;