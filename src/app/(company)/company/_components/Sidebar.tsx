import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full bg-slate-900 w-full border-r border-primary/10 shadow-xl">
      <div className="p-4 border-b border-primary/10">
        <Link href="/company" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary-light to-primary-dark flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-semibold text-sm">{APP_NAME}</span>
            <span className="text-primary text-xs">Company Portal</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;
