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
    <div className="flex items-center gap-3 w-full mt-6">
      {/* Search */}
      {setSearchQuery && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-700/50 border border-slate-600/50 text-white rounded-lg"
          />
        </div>
      )}

      {/* Filters */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-slate-700/50 border border-slate-600/50 text-white rounded-lg flex items-center gap-2",
              hasActiveFilters &&
                "border-green-500/50 bg-green-500/10 text-green-300"
            )}
          >
            <FilterIcon className="h-4 w-4" />
            Filters
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 bg-slate-800 border border-slate-700/50 rounded-xl shadow-lg"
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
                    icon: <Users className="text-slate-300" />,
                    activeColor: "bg-green-500/15 text-green-300",
                  },
                  {
                    value: "INFLUENCER",
                    label: "Influencers",
                    icon: <Users className="text-purple-400" />,
                    activeColor: "bg-purple-500/15 text-purple-300",
                  },
                  {
                    value: "COMPANY",
                    label: "Companies",
                    icon: <Building2 className="text-blue-400" />,
                    activeColor: "bg-blue-500/15 text-blue-300",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-slate-700/20" />
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
                    icon: <FilterIcon />,
                    activeColor: "bg-green-500/15 text-green-300",
                  },
                  {
                    value: "verified",
                    label: "Verified",
                    icon: <UserCheck className="text-green-400" />,
                    activeColor: "bg-green-500/15 text-green-300",
                  },
                  {
                    value: "not_verified",
                    label: "Pending",
                    icon: <UserX className="text-yellow-400" />,
                    activeColor: "bg-yellow-500/15 text-yellow-300",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-slate-700/20" />
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
                    icon: <FilterIcon />,
                    activeColor: "bg-green-500/15 text-green-300",
                  },
                  {
                    value: "true",
                    label: "Banned",
                    icon: <Ban className="text-red-400" />,
                    activeColor: "bg-red-500/15 text-red-300",
                  },
                  {
                    value: "false",
                    label: "Not Banned",
                    icon: <ShieldCheck className="text-green-400" />,
                    activeColor: "bg-green-500/15 text-green-300",
                  },
                ]}
              />
              <DropdownMenuSeparator className="bg-slate-700/20" />
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
                  icon: <FilterIcon />,
                  activeColor: "bg-green-500/15 text-green-300",
                },
                {
                  value: "true",
                  label: "Active Only",
                  icon: <Power className="text-green-400" />,
                  activeColor: "bg-green-500/15 text-green-300",
                },
                {
                  value: "false",
                  label: "Inactive",
                  icon: <ShieldAlert className="text-orange-400" />,
                  activeColor: "bg-orange-500/15 text-orange-300",
                },
              ]}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear */}
      {hasActiveFilters && clearFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="bg-slate-700/50 text-slate-300 hover:bg-red-500/10 hover:text-red-300 border border-slate-600/50 hover:border-red-500/50 rounded-lg"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};