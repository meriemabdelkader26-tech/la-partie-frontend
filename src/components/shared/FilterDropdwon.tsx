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
      <DropdownMenuLabel className="text-xs font-semibold text-slate-300 uppercase tracking-wide px-2 py-1.5">
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
                "text-sm text-slate-300 cursor-pointer rounded-md transition-colors mx-1",
                "hover:bg-slate-700/50 focus:bg-slate-700/50",
                isActive && opt.activeColor
              )}
            >
              {opt.icon && <span className="mr-2 h-4 w-4">{opt.icon}</span>}
              {opt.label}

              {isActive && (
                <CheckCircle2 className="ml-auto h-4 w-4 text-green-400" />
              )}
            </DropdownMenuItem>
          );
        })}
      </div>
    </div>
  );
};
