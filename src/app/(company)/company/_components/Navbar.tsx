"use client";



import { useSessionStore } from "@/stores/use-session-store";

import MobileSidebar from "./MobileSidebar";

import AvatarDropdown from "@/app/(admin)/admin/_components/AvatarDropdown";

import { APP_NAME } from "@/constant";



const Navbar = () => {

  const { currentUser } = useSessionStore();



  return (
    <nav className="navbar-light p-4 border-b h-full flex items-center shadow-sm">
      <MobileSidebar />
      {/* Brand/Logo area */}
      <div className="flex items-center gap-2 ml-4">
        <div className="w-8 h-8 rounded-xl logo-gradient flex items-center justify-center">
          <span className="text-navy font-bold text-base">B</span>
        </div>
        <span className="text-navy font-semibold hidden md:block tracking-wide text-lg">
          {APP_NAME}
        </span>
      </div>
      <div className="flex flex-1 justify-end">
        <AvatarDropdown email={currentUser?.email || ""} name={currentUser?.role || ""} />
      </div>
    </nav>
  );

};



export default Navbar;

