import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full bg-white w-full border-r border-black/5 shadow-soft animate-slideInLeft">
      <div className="p-8 border-b border-black/5">
        <Link href="/company/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-soft transition-all duration-500 group-hover:scale-110">
            <span className="text-white font-black text-2xl">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-black font-black text-xl tracking-tighter leading-none group-hover:text-gray-700 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">
              Company
            </span>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <Navigation />
      </div>
    </aside>
  );
};

export default Sidebar;
