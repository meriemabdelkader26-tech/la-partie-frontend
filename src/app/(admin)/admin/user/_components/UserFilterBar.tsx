"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  UserCheck,
  UserX,
  FilterIcon,
  X,
  ChevronDown,
  Building2,
  Users,
  Ban,
  Power,
  ShieldAlert,
  ShieldCheck,
  Search,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FilterSection } from "@/components/shared/FilterDropdwon";

interface UserFilterBarProps {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;

  filterRole?: string | null;
  setFilterRole?: (value: string | null) => void;

  filterVerification?: string | null;
  setFilterVerification?: (value: string | null) => void;

  filterBanned?: string | null;
  setFilterBanned?: (value: string | null) => void;

  filterActive?: string | null;
  setFilterActive?: (value: string | null) => void;

  hasActiveFilters?: boolean;
  clearFilters?: () => void;
}

export const UserFilterBar = ({
  searchQuery,
  setSearchQuery,
  filterRole,
  setFilterRole,
  filterVerification,
  setFilterVerification,
  filterBanned,
  setFilterBanned,
  filterActive,
  setFilterActive,
  hasActiveFilters,
  clearFilters,
}: UserFilterBarProps) => {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Search */}
      {setSearchQuery && (
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 shadow-sm transition-all"
          />
        </div>
      )}

      {/* Filters */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-11 px-4 bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-all",
              hasActiveFilters &&
                "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
            )}
          >
            <FilterIcon className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95"
        >
          {setFilterRole && (
            <>
              <FilterSection
                title="Role"
                selected={filterRole}
                onSelect={setFilterRole}
                options={[
                  {
                    value: null,
                    label: "All Users",
                    icon: <Users className="text-gray-500 w-4 h-4" />,
                    activeColor: "bg-gray-100 text-gray-900 font-medium",
                  },
                  {
                    value: "INFLUENCER",
                    label: "Influencers",
                    icon: <Users className="text-purple-500 w-4 h-4" />,
                    activeColor: "bg-purple-50 text-purple-700 font-medium",
                  },
                  {
                    value: "COMPANY",
                    label: "Companies",
                    icon: <Building2 className="text-blue-500 w-4 h-4" />,
                    activeColor: "bg-blue-50 text-blue-700 font-medium",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-gray-100 my-2" />
            </>
          )}

          {setFilterVerification && (
            <>
              <FilterSection
                title="Verification"
                selected={filterVerification}
                onSelect={setFilterVerification}
                options={[
                  {
                    value: null,
                    label: "All Status",
                    icon: <FilterIcon className="w-4 h-4 text-gray-500" />,
                    activeColor: "bg-gray-100 text-gray-900 font-medium",
                  },
                  {
                    value: "verified",
                    label: "Verified",
                    icon: <UserCheck className="text-emerald-500 w-4 h-4" />,
                    activeColor: "bg-emerald-50 text-emerald-700 font-medium",
                  },
                  {
                    value: "not_verified",
                    label: "Pending",
                    icon: <UserX className="text-amber-500 w-4 h-4" />,
                    activeColor: "bg-amber-50 text-amber-700 font-medium",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-gray-100 my-2" />
            </>
          )}

          {setFilterBanned && (
            <>
              <FilterSection
                title="Ban Status"
                selected={filterBanned}
                onSelect={setFilterBanned}
                options={[
                  {
                    value: null,
                    label: "All Users",
                    icon: <FilterIcon className="w-4 h-4 text-gray-500" />,
                    activeColor: "bg-gray-100 text-gray-900 font-medium",
                  },
                  {
                    value: "true",
                    label: "Banned",
                    icon: <Ban className="text-rose-500 w-4 h-4" />,
                    activeColor: "bg-rose-50 text-rose-700 font-medium",
                  },
                  {
                    value: "false",
                    label: "Not Banned",
                    icon: <ShieldCheck className="text-emerald-500 w-4 h-4" />,
                    activeColor: "bg-emerald-50 text-emerald-700 font-medium",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-gray-100 my-2" />
            </>
          )}

          {setFilterActive && (
            <FilterSection
              title="Active Status"
              selected={filterActive}
              onSelect={setFilterActive}
              options={[
                {
                  value: null,
                  label: "All Users",
                  icon: <FilterIcon className="w-4 h-4 text-gray-500" />,
                  activeColor: "bg-gray-100 text-gray-900 font-medium",
                },
                {
                  value: "true",
                  label: "Active Only",
                  icon: <Power className="text-emerald-500 w-4 h-4" />,
                  activeColor: "bg-emerald-50 text-emerald-700 font-medium",
                },
                {
                  value: "false",
                  label: "Inactive",
                  icon: <ShieldAlert className="text-amber-500 w-4 h-4" />,
                  activeColor: "bg-amber-50 text-amber-700 font-medium",
                },
              ]}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear */}
      {hasActiveFilters && clearFilters && (
        <Button
          variant="ghost"
          onClick={clearFilters}
          className="h-11 px-4 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl font-medium transition-all"
        >
          <X className="h-4 w-4 mr-1.5" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};