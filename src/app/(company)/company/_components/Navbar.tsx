"use client";



import { useSessionStore } from "@/stores/use-session-store";

import MobileSidebar from "./MobileSidebar";

import AvatarDropdown from "@/app/(admin)/admin/_components/AvatarDropdown";

import { APP_NAME } from "@/constant";



const Navbar = () => {

  const { currentUser } = useSessionStore();



  return (

    <nav className="p-4 border-b border-primary/10 h-full flex items-center bg-slate-900/95 backdrop-blur-sm shadow-lg shadow-primary/5">

      <MobileSidebar />



      {/* Brand/Logo area */}

      <div className="flex items-center gap-2 ml-4">

        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary-light to-primary-dark flex items-center justify-center">

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

