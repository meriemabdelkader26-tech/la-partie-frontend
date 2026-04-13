import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
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
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="size-6 text-green-500" />
          <h1 className="text-2xl font-bold text-white">Influencers</h1>
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
          { label: "Influencer", href: "/admin/influencer" },
        ]}
      />

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <InfluencerSearchBar
            value={searchQuery || ""}
            onChange={handleSearchChange}
          />
        </div>
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
  );
};

export default InfluencerFilters;