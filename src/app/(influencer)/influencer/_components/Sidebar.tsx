import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full bg-pastel-blue w-full border-r border-pastel-dark-blue/20 shadow-xl">
      <div className="p-4 border-b border-pastel-dark-blue/20">
        <Link href="/influencer" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg" style={{background: 'linear-gradient(135deg, #BED3C3 0%, #4A919E 100%)'}}>
            <span className="text-pastel-dark-blue font-bold text-lg">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-pastel-dark-blue font-semibold text-sm">{APP_NAME}</span>
            <span className="text-pastel-blue text-xs">Influencer Portal</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;
