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
    (href !== "/" && href !== "/admin" && pathname?.startsWith(`${href}/`));

  const onclick = () => {
    router.push(href);
  };
  return (
    <button
      onClick={onclick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-[var(--sidebar-text)] text-base font-medium pl-6 pr-2 transition-all rounded-xl h-12 relative group",
        isActive
          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] border-l-4 border-[var(--sidebar-active-border)] shadow-soft"
          : "hover:bg-[var(--sidebar-hover)] hover:text-primary"
      )}
      style={{ boxShadow: isActive ? "0 2px 8px 0 rgba(60,60,60,0.07)" : undefined }}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            isActive ? "text-primary" : "text-[var(--sidebar-text)] group-hover:text-primary"
          )}
        />
        {label}
      </div>
      {isActive && (
        <span className="absolute left-0 top-0 h-full w-1 bg-primary rounded-r-xl" />
      )}
    </button>
  );
};