import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  title: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
}

const IconHeader = (props: Props) => {
  const { icon: Icon, title, className, iconClassName, titleClassName } = props;
  return (
    <div className={cn("flex items-center gap-3 mb-3", className)}>
      <Icon className={cn("size-6 text-green-500", iconClassName)} />
      <p className={cn("text-lg font-semibold text-white", titleClassName)}>
        {title}
      </p>
    </div>
  );
};

export default IconHeader;
