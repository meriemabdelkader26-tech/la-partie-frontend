"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle2,
  Shield,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import { User } from "@/app/types";
import ActionButtons from "./ActionButtons";

type ColumnHeaderProps = {
  label: string;
  field: string;
  currentOrderBy: string;
  onOrderChange: (orderBy: string) => void;
};

const SortableColumnHeader = ({
  label,
  field,
  currentOrderBy,
  onOrderChange,
}: ColumnHeaderProps) => {
  const isAscending = currentOrderBy === field;
  const isDescending = currentOrderBy === `-${field}`;
  const isActive = isAscending || isDescending;

  const handleClick = () => {
    if (isAscending) {
      onOrderChange(`-${field}`);
    } else {
      onOrderChange(field);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-emerald-500 transition-colors group"
    >
      {label}
      {isActive ? (
        isAscending ? (
          <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />
        )
      ) : (
        <ArrowUpDown className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-400 transition-colors" />
      )}
    </button>
  );
};

export const createColumns = (
  orderBy: string,
  onOrderChange: (orderBy: string) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center lg:w-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
              ? "indeterminate"
              : false
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center lg:w-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-gray-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => (
      <SortableColumnHeader
        label="User Info"
        field="name"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 py-1.5">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-sm text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Mail className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">{user.email}</span>
              {user.emailVerified ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <Clock className="w-3 h-3 text-amber-500" />
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.phoneNumber ? (
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
              <Phone className="w-3 h-3 text-gray-400" />
              <span className="text-xs font-medium text-gray-700">
                {row.original.phoneNumber}
              </span>
              {row.original.phoneNumberVerified ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <Clock className="w-3 h-3 text-amber-500" />
              )}
            </div>
          ) : (
            <span className="text-xs font-medium text-gray-400 italic">—</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <SortableColumnHeader
        label="Type"
        field="role"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      const isCompany = row.original.role === "COMPANY";
      return (
        <span
          className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-md transition-all duration-150 uppercase tracking-widest",
            isCompany
              ? "bg-blue-50 text-blue-700 border border-blue-100"
              : row.original.role === "ADMIN" 
                ? "bg-rose-50 text-rose-700 border border-rose-100" 
                : "bg-purple-50 text-purple-700 border border-purple-100"
          )}
        >
          {isCompany ? "Brand" : row.original.role === "ADMIN" ? "Admin" : "Influencer"}
        </span>
      );
    },
  },
  {
    accessorKey: "isCompletedProfile",
    header: () => <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Setup</span>,
    cell: ({ row }) => {
        return row.original.isCompletedProfile ? (
          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest">Complete</span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-widest">Incomplete</span>
        );
    },
  },
  {
    accessorKey: "isVerifyByAdmin",
    header: () => (
      <SortableColumnHeader
        label="Platform Access"
        field="is_active"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      if (row.original.isVerifyByAdmin === true) {
        return (
          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Approved</span>
          </div>
        );
      } else if (row.original.isVerifyByAdmin === "rejected" as any) {
        return (
          <div className="flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md w-fit">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Rejected</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-md w-fit">
            <Shield className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <SortableColumnHeader
        label="Joined Date"
        field="created_at"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-gray-500">
          {formatDate(new Date(row.original.createdAt!), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</span>
    ),
    cell: ({ row }) => {
      return <ActionButtons user={row.original} />;
    },
  },
];