import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { InfluencerSearchBar } from "./influencerSearchBar";
import InfluencerSheet from "./InfluencerSheet";

interface Props {
  searchQuery: string;
  handleSearchChange: (value: string) => void;
  activeFiltersCount: number;
  onClearAll: () => void;
  startDate: Date | null;
  endDate: Date | null;
  disponibilite: string | null;
  maxEngagement: string | null;
  maxFollowers: string | null;
  ordering: string | null;
  setStartDate: (value: Date | null) => void;
  setEndDate: (value: Date | null) => void;
  setDisponibilite: (value: string | null) => void;
  setMaxEngagement: (value: string | null) => void;
  setMaxFollowers: (value: string | null) => void;
  setOrdering: (value: string | null) => void;
  setPage: (value: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

const InfluencerFilters = (props: Props) => {
  const {
    activeFiltersCount,
    searchQuery,
    handleSearchChange,
    onClearAll,
    startDate,
    endDate,
    disponibilite,
    maxEngagement,
    maxFollowers,
    ordering,
    setStartDate,
    setEndDate,
    setDisponibilite,
    setMaxEngagement,
    setMaxFollowers,
    setOrdering,
    setPage,
    totalItems,
    startIndex,
    endIndex,
  } = props;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Influencers
            </h1>
            <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm ml-2">
              {totalItems} Total
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Browse and manage influencers on the platform.
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
        </div>
      </div>

      <div className="w-full bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <InfluencerSearchBar
            value={searchQuery || ""}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <InfluencerSheet
            activeFiltersCount={activeFiltersCount}
            startDate={startDate}
            endDate={endDate}
            disponibilite={disponibilite}
            maxEngagement={maxEngagement}
            maxFollowers={maxFollowers}
            ordering={ordering}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setDisponibilite={setDisponibilite}
            setMaxEngagement={setMaxEngagement}
            setMaxFollowers={setMaxFollowers}
            setOrdering={setOrdering}
            setPage={setPage}
            onClearAll={onClearAll}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </div>
      </div>

      <div className="w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Influencers", href: "/admin/influencer" },
          ]}
        />
      </div>
    </div>
  );
};

export default InfluencerFilters;