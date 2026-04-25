import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";
import { Shield } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="h-full w-full flex flex-col bg-transparent">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-3 group w-full hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-large group-hover:rotate-12 transition-transform">
            <Shield className="w-6 h-6 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight text-white">{APP_NAME}</span>
            <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <Navigation />

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-white/10">
        <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <p className="text-white/60 text-xs font-medium mb-1">Version</p>
          <p className="text-white text-sm font-bold">1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;