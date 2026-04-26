"use client";

import { usePathname } from "next/navigation";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import { PendingApprovalOverlay } from "@/components/shared/PendingApprovalOverlay";

interface Props {
  children: React.ReactNode;
}

const InfluencerLayout = ({ children }: Props) => {
  const pathname = usePathname();

  if (pathname?.endsWith("/complete-profile")) {
    return <main>{children}</main>;
  }

  return (
    <div className="h-full bg-gray-50/50">
      <PendingApprovalOverlay />
      <div className="h-20 md:pl-56 fixed inset-y-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <Navbar />
      </div>
      <div className="hidden md:flex min-h-screen w-56 flex-col fixed inset-y-0 z-50 bg-white border-r border-black/5 shadow-soft">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-20 h-full min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default InfluencerLayout;
