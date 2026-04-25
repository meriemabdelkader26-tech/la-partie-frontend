import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
  notificationCount?: number;
}

export const SidebarItem = ({ icon: Icon, label, href, notificationCount }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  // More precise active route matching
  const isActive =
    pathname === href || // Exact match
    (href !== "/" && href !== "/admin" && pathname?.startsWith(`${href}/`));

  const onclick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onclick}
      type="button"
      className={cn(
        "flex items-center gap-x-3 text-base font-semibold mx-3 px-4 py-3 transition-all rounded-xl relative group mb-1 w-[calc(100%-1.5rem)]",
        isActive
          ? "bg-white text-black shadow-large"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      )}
    >
      <div className="flex items-center gap-x-3 flex-1">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center transition-all shrink-0",
          isActive ? "bg-black text-white" : "bg-white/10 text-white group-hover:bg-white/20"
        )}>
          <Icon size={20} />
        </div>
        <span>{label}</span>
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className={cn(
            "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
            isActive ? "bg-black text-white" : "bg-white text-black"
          )}>
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </div>
      {isActive && !notificationCount && (
        <div className="absolute right-3 w-2 h-2 bg-black rounded-full"></div>
      )}
    </button>
  );
};