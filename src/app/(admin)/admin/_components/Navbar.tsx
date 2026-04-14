"use client";



import { useSessionStore } from "@/stores/use-session-store";

import AvatarDropdown from "./AvatarDropdown";


import { APP_NAME } from "@/constant";



const Navbar = () => {

  const { currentUser } = useSessionStore();


  return (
    <nav className="w-full flex items-center justify-between px-6 h-16 bg-white shadow-none border-none">
      {/* Brand/Logo area */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
          <span className="text-white font-bold text-base">I</span>
        </div>
        <span className="font-semibold hidden md:block tracking-wide text-lg text-title">
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