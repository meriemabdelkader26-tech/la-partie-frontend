import Link from "next/link";
import Navigation from "./Navigation";
import { APP_NAME } from "@/constant";

const Sidebar = () => {
  return (
    <aside className="h-full w-full border-r shadow-none bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col" style={{}}>
      <div className="p-6 border-b border-[var(--border)] flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-lg">I</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base tracking-wide text-[var(--sidebar-text)]">influBridge</span>
            <span className="text-muted text-xs">Admin Panel</span>
          </div>
        </Link>
      </div>
      <Navigation />
    </aside>
  );
};

export default Sidebar;