"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";

interface Props {
  children: React.ReactNode;
}

const InfluencerLayout = ({ children }: Props) => {
  const pathname = usePathname();

  if (pathname?.endsWith("/complete-profile")) {
    return <main>{children}</main>;
  }

  return (
    <div className="h-full bg-pastel-green/30">
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 bg-pastel-dark-blue/90 backdrop-blur-sm border-b border-pastel-dark-blue/20">
        <Navbar />
      </div>
      <div className="hidden md:flex min-h-screen w-56 flex-col fixed inset-y-0 z-50 bg-pastel-blue border-r border-pastel-dark-blue/20">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full min-h-screen bg-transparent">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
};

export default InfluencerLayout;
