import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search, FilterIcon } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="relative flex-1 w-full max-w-md group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="Search by category name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10 h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm transition-all"
        />
      </div>

      <Select
        value={isActiveFilter}
        onValueChange={(value) => {
          setIsActiveFilter(value as "true" | "false" | "all");
          setPage(1);
        }}
      >
        <SelectTrigger className="w-[180px] h-11 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium shadow-sm transition-all">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-gray-400" />
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-100 rounded-xl shadow-lg">
          <SelectItem
            value="all"
            className="text-gray-700 hover:bg-gray-50 cursor-pointer focus:bg-gray-50"
          >
            All Status
          </SelectItem>
          <SelectItem
            value="true"
            className="text-emerald-600 font-medium hover:bg-emerald-50 cursor-pointer focus:bg-emerald-50"
          >
            Active Only
          </SelectItem>
          <SelectItem
            value="false"
            className="text-amber-600 font-medium hover:bg-amber-50 cursor-pointer focus:bg-amber-50"
          >
            Inactive Only
          </SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          onClick={clearFilters}
          variant="ghost"
          className="h-11 px-4 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-medium transition-all"
        >
          <X className="mr-1.5 h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default Filter;