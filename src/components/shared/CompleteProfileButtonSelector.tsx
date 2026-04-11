import { cn } from "@/lib/utils";

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
        "px-4 py-2 rounded-lg font-medium transition-colors",
        isSelected
          ? "bg-primary text-white"
          : "bg-slate-700 text-white hover:bg-slate-600"
      )}
    >
      {type}
    </button>
  );
};

export default CompleteProfileButtonSelector;
