import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full w-full border-r shadow-none rounded-tr-2xl rounded-br-2xl bg-pastel-dark-blue/80" style={{}}>
      <div className="p-4 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl logo-gradient flex items-center justify-center">
            <span className="text-navy font-bold text-lg">I</span>
          </div>
          <div className="flex flex-col">
            <span className="text-navy font-semibold text-base tracking-wide">{APP_NAME}</span>
            <span className="text-teal text-xs">Admin Panel</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;