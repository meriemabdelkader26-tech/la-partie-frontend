"use client";



import { useSessionStore } from "@/stores/use-session-store";

import MobileSidebar from "./MobileSidebar";

import AvatarDropdown from "@/app/(admin)/admin/_components/AvatarDropdown";

import { APP_NAME } from "@/constant";



const Navbar = () => {

  const { currentUser } = useSessionStore();



  return (

    <nav className="p-4 border-b border-pastel-dark-blue/20 h-full flex items-center bg-pastel-dark-blue/90 backdrop-blur-sm shadow-lg shadow-pastel-dark-blue/10">

      <MobileSidebar />



      {/* Brand/Logo area */}

      <div className="flex items-center gap-2 ml-4">

        <div className="w-8 h-8 rounded-lg" style={{background: 'linear-gradient(135deg, #BED3C3 0%, #4A919E 100%)'}}>

          <span className="text-pastel-dark-blue font-bold text-sm">B</span>

        </div>

        <span className="text-pastel-green font-semibold hidden md:block">

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

