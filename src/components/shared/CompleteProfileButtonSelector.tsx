import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  type: string;
  onClick: () => void;
  isSelected: boolean;
}

const CompleteProfileButtonSelector = ({
  type,
  isSelected,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative px-6 py-4 rounded-2xl font-semibold transition-all duration-300 text-left overflow-hidden group",
        isSelected
          ? "bg-black text-white shadow-large scale-105 ring-4 ring-black/20"
          : "bg-white text-black border-2 border-black/10 hover:border-black/30 hover:scale-105 shadow-soft hover:shadow-medium"
      )}
    >
      {/* Background Pattern */}
      <div className={cn(
        "absolute inset-0 opacity-0 transition-opacity duration-300",
        isSelected ? "opacity-5" : "group-hover:opacity-5"
      )}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-base break-words flex-1">{type}</span>
        
        {/* Checkmark */}
        <div className={cn(
          "w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all duration-300",
          isSelected
            ? "bg-white scale-100 opacity-100"
            : "bg-black/5 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-30"
        )}>
          <Check className={cn(
            "w-4 h-4 transition-colors",
            isSelected ? "text-black" : "text-black"
          )} strokeWidth={3} />
        </div>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white animate-shimmer"></div>
      )}
    </button>
  );
};

export default CompleteProfileButtonSelector;
