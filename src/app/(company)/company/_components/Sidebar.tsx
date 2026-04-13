import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="sidebar-bg h-full w-full border-r shadow-none rounded-tr-2xl rounded-br-2xl">
      <div className="p-4 border-b border-border">
        <Link href="/company" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl logo-gradient flex items-center justify-center">
            <span className="text-navy font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-navy font-semibold text-base tracking-wide">{APP_NAME}</span>
            <span className="text-teal text-xs">Company Portal</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;
