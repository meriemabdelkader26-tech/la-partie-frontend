import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Slash } from "lucide-react";

interface Props {
  breadCrumbs: Array<{ label: string; href: string }>;
}

const BreadCrumbList = ({ breadCrumbs }: Props) => {
  const lastItem = breadCrumbs.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadCrumbs.map((item, index) => (
          <div key={item.label} className="flex gap-2 items-center">
            <BreadcrumbItem>
              <BreadcrumbLink
                href={item.href}
                className={cn(
                  "font-normal text-sm text-slate-400 hover:text-primary transition-colors",
                  index == 0 && "font-medium text-slate-300"
                )}
              >
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index != lastItem && (
              <BreadcrumbSeparator>
                <Slash className="size-2 text-slate-500" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbList;
