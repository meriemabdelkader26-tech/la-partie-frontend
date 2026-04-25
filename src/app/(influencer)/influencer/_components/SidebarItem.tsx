import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
  notificationCount?: number;
  idPrefix?: string;
}

export const SidebarItem = ({ icon: Icon, label, href, notificationCount, idPrefix = "desktop" }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const safeId = `${idPrefix}-sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // More precise active route matching
  const isActive =
    pathname === href || // Exact match
    (href !== "/" &&
      href !== "/influencer" &&
      pathname?.startsWith(`${href}/`));

  const onclick = () => {
    router.push(href);
  };

  return (
    <button
      id={safeId}
      onClick={onclick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-gray-500 text-sm font-medium pl-6 transition-all hover:text-black hover:bg-gray-50 h-12 w-full rounded-xl mb-1 relative",
        isActive &&
          "text-black bg-gray-100 hover:bg-gray-200"
      )}
    >
      <div className="flex items-center gap-x-2 py-4 flex-1">
          <Icon
            size={22}
            className={cn("text-gray-500", isActive && "text-black")}
        />
        {label}
        {notificationCount !== undefined && notificationCount > 0 && (
          <span className="ml-auto mr-4 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 h-full transition-all border-black",
          isActive && !notificationCount && "opacity-100"
        )}
      />
    </button>
  );
};
