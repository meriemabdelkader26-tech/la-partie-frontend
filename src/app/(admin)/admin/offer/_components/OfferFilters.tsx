import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, SlidersHorizontal, Plus, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import BreadCrumbList from "@/components/shared/BreadCrumbList";

interface OfferFiltersProps {
  activeFiltersCount: number;
  onClearAll: () => void;
  totalItems?: number;
}

export const OfferFilters = ({
  activeFiltersCount,
  onClearAll,
  totalItems = 0,
}: OfferFiltersProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Campaign Offers</h1>
            <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm ml-2">
              {totalItems} Total
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Browse and manage collaboration offers for influencers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={onClearAll}
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-medium transition-all"
            >
              <X className="w-4 h-4 mr-1.5" />
              Clear Filters
            </Button>
          )}
          <Button
            onClick={() => router.push("/admin/offer/create")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white h-12 px-6 rounded-xl font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Offer
          </Button>
        </div>
      </div>
      <div className="w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Offers", href: "/admin/offer" },
          ]}
        />
      </div>
    </div>
  );
};