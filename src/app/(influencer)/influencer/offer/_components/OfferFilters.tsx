import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import BreadCrumbList from "@/components/shared/BreadCrumbList";

interface OfferFiltersProps {
  activeFiltersCount: number;
  onClearAll: () => void;
}

export const OfferFilters = ({
  activeFiltersCount,
  onClearAll,
}: OfferFiltersProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="size-6 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Offers</h1>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-green-600 text-white">
              {activeFiltersCount} active{" "}
              {activeFiltersCount === 1 ? "filter" : "filters"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <X className="size-4 mr-2" />
              Clear all
            </Button>
          )}
        </div>
      </div>
      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Offer", href: "/admin/offer" },
        ]}
      />
    </div>
  );
};
