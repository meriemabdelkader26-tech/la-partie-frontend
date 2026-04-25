import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  className?: string;
}

const SecondButton = ({
  label,
  onClick,
  isLoading = false,
  className,
}: Props) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "bg-black hover:bg-gray-800 text-white font-semibold px-6 rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:scale-100",
        className
      )}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {label}
    </Button>
  );
};

export default SecondButton;
