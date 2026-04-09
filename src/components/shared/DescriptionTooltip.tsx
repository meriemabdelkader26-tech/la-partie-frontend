import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function DescriptionTooltip({ title, description }: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="p-3!">
            <InfoIcon className="size-4 text-emerald-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="py-3 bg-slate-700 border-slate-600 w-[300px]">
          <div className="space-y-1">
            <p className="text-[13px] font-medium text-white">{title}</p>
            <p className="text-xs text-slate-300">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
