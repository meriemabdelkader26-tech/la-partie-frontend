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
      variant="outline"
      size="sm"
      disabled={isLoading}
      className={cn(
        "bg-transparent border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 hover:text-emerald-400 disabled:opacity-50",
        className
      )}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {label}
    </Button>
  );
};

export default SecondButton;
