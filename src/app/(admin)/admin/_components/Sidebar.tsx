import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full bg-slate-900 w-full border-r border-emerald-500/10 shadow-xl">
      <div className="p-4 border-b border-emerald-500/10">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">{APP_NAME}</span>
            <span className="text-emerald-400 text-xs">Admin Panel</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;