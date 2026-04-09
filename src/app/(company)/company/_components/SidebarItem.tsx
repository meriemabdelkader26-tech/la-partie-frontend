import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

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
      onClick={onclick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-medium pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 h-12",
        isActive &&
          "text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:text-emerald-400"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-emerald-400")}
        />
        {label}
      </div>

      <div
        className={cn(
          "ml-auto opacity-0 border-2 h-full transition-all",
          isActive && "opacity-100 border-emerald-400"
        )}
      />
    </button>
  );
};
