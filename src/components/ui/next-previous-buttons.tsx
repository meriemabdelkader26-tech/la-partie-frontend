import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onNextClick: () => void;
  onPreviousClick: () => void;
  isNextDisabled: boolean;
  isPreviousDisabled: boolean;
  className?: string;
};

export default function NextAndPreviousButtons({
  onNextClick,
  onPreviousClick,
  isNextDisabled,
  isPreviousDisabled,

  className,
}: Props) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Button
        onClick={onPreviousClick}
        disabled={isPreviousDisabled}
        className="h-9 px-3 border hover:bg-neutral-100 transition-colors"
        variant="outline"
        aria-label="Previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="ml-1 text-sm font-medium">Previous</span>
      </Button>

      <Button
        onClick={onNextClick}
        disabled={isNextDisabled}
        className="h-9 px-3 border hover:bg-neutral-100 transition-colors"
        variant="outline"
        aria-label="Next page"
      >
        <span className="mr-1 text-sm font-medium">Next</span>
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
