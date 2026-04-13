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
        "flex items-center gap-x-2 text-[#212E53] text-base font-medium pl-6 transition-all rounded-xl hover:text-[#4A919E] hover:bg-[#E3F6F8]/60 h-12",
        isActive &&
          "text-[#CE6A6B] bg-[#FDECEF]/80 hover:bg-[#FDECEF] hover:text-[#CE6A6B]"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn("text-[#212E53]", isActive && "text-[#CE6A6B]")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 h-full transition-all rounded-xl",
          isActive && "opacity-100 border-[#CE6A6B]"
        )}
      />
    </button>
  );
};