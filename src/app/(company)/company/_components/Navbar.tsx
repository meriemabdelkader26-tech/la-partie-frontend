"use client";

import { useSessionStore } from "@/stores/use-session-store";
import MobileSidebar from "./MobileSidebar";
import AvatarDropdown from "@/app/(admin)/admin/_components/AvatarDropdown";
import NotificationsDropdown from "@/app/_components/NotificationsDropdown";
import { APP_NAME } from "@/constant";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
  const { currentUser } = useSessionStore();

  return (
    <nav className="px-6 py-4 border-b border-black/5 h-full flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <MobileSidebar />
        
        {/* Brand/Logo area */}
        <div className="flex items-center gap-3 ml-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center shadow-soft group-hover:scale-110 transition-all duration-500">
            <span className="text-white font-black text-xl">B</span>
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-black font-black text-lg tracking-tighter leading-none">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1.5">
              Company Portal
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-gray-50 border border-black/5 rounded-2xl px-4 py-2 w-64 focus-within:bg-white focus-within:border-black/20 transition-all duration-300">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search influencers..." 
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
          />
        </div>

        <NotificationsDropdown />

        <div className="w-px h-8 bg-black/5 mx-2"></div>

        <AvatarDropdown 
          email={currentUser?.email || ""} 
          name={currentUser?.name || "User"} 
        />
      </div>
    </nav>
  );
};

export default Navbar;
