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
      className="flex items-center gap-2 text-sm font-semibold text-white hover:text-green-400 transition-colors"
    >
      {label}
      {isActive ? (
        isAscending ? (
          <ArrowUp className="size-4 text-green-400" />
        ) : (
          <ArrowDown className="size-4 text-green-400" />
        )
      ) : (
        <ArrowUpDown className="size-4 text-slate-500" />
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
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <div className="pl-4 h-full">
        <span
          className={cn(
            "flex origin-center w-1 transition-transform scale-y-0 h-full bg-green-500 rounded-r-full absolute left-0 top-0",
            { "scale-y-100": row.getIsSelected() }
          )}
        ></span>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
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
        label="Full Name"
        field="name"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm font-medium text-white">{row.original.name}</p>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => (
      <SortableColumnHeader
        label="Email"
        field="email"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-300">{row.original.email}</p>
          {row.original.emailVerified ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <Clock className="size-4 text-yellow-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <p className="text-sm font-semibold text-white">Phone</p>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 h-14">
          <p className="text-sm text-slate-300">
            {row.original.phoneNumber ?? "N/A"}
          </p>
          {row.original.phoneNumberVerified ? (
            <CheckCircle2 className="size-4 text-green-500" />
          ) : (
            <Clock className="size-4 text-yellow-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: () => (
      <SortableColumnHeader
        label="Role"
        field="role"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      const role = row.original.role === "COMPANY" ? "Company" : "Influencer";
      const bgColor =
        row.original.role === "COMPANY" ? "bg-blue-500/20" : "bg-purple-500/20";
      const textColor =
        row.original.role === "COMPANY" ? "text-blue-400" : "text-purple-400";
      return (
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full",
            bgColor,
            textColor
          )}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "isCompletedProfile",
    header: () => <p className="text-sm font-semibold text-white">Profile</p>,
    cell: ({ row }) => {
      return row.original.isCompletedProfile ? (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-500/20 text-green-400">
          Complete
        </span>
      ) : (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
          Incomplete
        </span>
      );
    },
  },
  {
    accessorKey: "isVerifyByAdmin",
    header: () => (
      <SortableColumnHeader
        label="Verification"
        field="is_active"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.isVerifyByAdmin ? (
            <>
              <CheckCircle2 className="size-4 text-green-500" />
              <span className="text-xs text-green-400 font-medium">
                Verified
              </span>
            </>
          ) : (
            <>
              <Shield className="size-4 text-red-500" />
              <span className="text-xs text-red-400 font-medium">Pending</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <SortableColumnHeader
        label="Joined"
        field="created_at"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-slate-400">
          {formatDate(new Date(row.original.createdAt!), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => (
      <SortableColumnHeader
        label="Last Updated"
        field="updated_at"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-sm text-slate-400">
          {formatDate(new Date(row.original.updatedAt!), "MMM dd, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-sm font-semibold text-white">Actions</div>
    ),
    cell: ({ row }) => {
      return <ActionButtons user={row.original} />;
    },
  },
];