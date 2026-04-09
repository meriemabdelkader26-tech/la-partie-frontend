"use client";

import { useSessionStore } from "@/stores/use-session-store";
import MobileSidebar from "./MobileSidebar";
import AvatarDropdown from "@/app/(admin)/admin/_components/AvatarDropdown";
import { APP_NAME } from "@/constant";

const Navbar = () => {
  const { currentUser } = useSessionStore();

  return (
    <nav className="p-4 border-b border-emerald-500/10 h-full flex items-center bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-emerald-500/5">
      <MobileSidebar />

      {/* Brand/Logo area */}
      <div className="flex items-center gap-2 ml-4">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">B</span>
        </div>
        <span className="text-white font-semibold hidden md:block">
          {APP_NAME}
        </span>
      </div>

      <div className="flex flex-1 justify-end">
        <AvatarDropdown email={currentUser?.email!} name={currentUser?.role!} />
      </div>
    </nav>
  );
};

export default Navbar;
