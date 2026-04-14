import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  isActiveFilter: "true" | "false" | "all";
  setIsActiveFilter: (value: "true" | "false" | "all") => void;
  setPage: (value: number) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

const Filter = ({
  search,
  setSearch,
  setPage,
  isActiveFilter,
  setIsActiveFilter,
  hasActiveFilters,
  clearFilters,
}: Props) => {
  return (
    <div className="flex items-center gap-3 w-full mt-6 mb-4">
      <Input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="max-w-sm bg-[#6B7280] border border-[#6B7280] text-white placeholder-white focus:border-[#6B7280] focus:ring-[#6B7280]"
      />

      <Select
        value={isActiveFilter}
        onValueChange={(value) => {
          setIsActiveFilter(value as "true" | "false" | "all");
          setPage(1);
        }}
      >
        <SelectTrigger className="w-[180px] bg-[#6B7280] border border-[#6B7280] text-white hover:border-[#6B7280]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent className="bg-[#6B7280] border border-[#6B7280]">
          <SelectItem
            value="all"
            className="text-white hover:bg-[#6B7280]/10 focus:bg-[#6B7280]/10"
          >
            All
          </SelectItem>
          <SelectItem
            value="true"
            className="text-emerald-400 hover:bg-emerald-500/10 focus:bg-emerald-500/10"
          >
            Active
          </SelectItem>
          <SelectItem
            value="false"
            className="text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10"
          >
            Inactive
          </SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="outline"
          className="bg-slate-700 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 hover:border-emerald-500"
        >
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default Filter;