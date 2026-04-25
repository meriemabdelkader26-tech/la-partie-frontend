"use client";
import {
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

interface FilterOption {
  value: string | null;
  label: string;
  icon?: React.ReactNode;
  activeColor?: string;
}

interface Props {
  title: string;
  selected: string | null | undefined;
  onSelect: (value: string | null) => void;
  options: FilterOption[];
}

export const FilterSection = (props: Props) => {
  const { title, selected, onSelect, options } = props;
  return (
    <div className="px-2 py-2">
      <DropdownMenuLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 py-2">
        {title}
      </DropdownMenuLabel>

      <div className="space-y-1">
        {options.map((opt, i) => {
          const isActive =
            selected === opt.value || (!selected && opt.value === null);

          return (
            <DropdownMenuItem
              key={i}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "text-sm text-gray-700 cursor-pointer rounded-xl transition-all mx-1 px-3 py-2.5 flex items-center",
                "hover:bg-gray-50 focus:bg-gray-50",
                isActive && opt.activeColor
              )}
            >
              {opt.icon && <span className="mr-3 flex items-center justify-center">{opt.icon}</span>}
              <span className={cn("font-medium", isActive && "font-bold")}>{opt.label}</span>

              {isActive && (
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
              )}
            </DropdownMenuItem>
          );
        })}
      </div>
    </div>
  );
};
