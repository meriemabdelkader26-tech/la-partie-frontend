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
        <span className="text-base font-semibold text-title">{row.original.name}</span>
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
          <span className="text-base text-text">{row.original.email}</span>
          {row.original.emailVerified ? (
            <CheckCircle2 className="size-4 text-success" />
          ) : (
            <Clock className="size-4 text-warning" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => <span className="text-base font-semibold text-title">Phone</span>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 h-14">
          <span className="text-base text-text">
            {row.original.phoneNumber ?? "N/A"}
          </span>
          {row.original.phoneNumberVerified ? (
            <CheckCircle2 className="size-4 text-success" />
          ) : (
            <Clock className="size-4 text-warning" />
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
      const badgeColor =
        row.original.role === "COMPANY"
          ? "bg-info/10 text-info border border-info/30"
          : "bg-purple-500/10 text-purple-500 border border-purple-500/30";
      return (
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full shadow-soft transition-all duration-150",
            badgeColor
          )}
        >
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "isCompletedProfile",
    header: () => <span className="text-base font-semibold text-title">Profile</span>,
    cell: ({ row }) => {
      return row.original.isCompletedProfile ? (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success border border-success/30 shadow-soft">Complete</span>
      ) : (
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-warning/10 text-warning border border-warning/30 shadow-soft">Incomplete</span>
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
              <CheckCircle2 className="size-4 text-success" />
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success border border-success/30 shadow-soft">Verified</span>
            </>
          ) : (
            <>
              <Shield className="size-4 text-danger" />
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-danger/10 text-danger border border-danger/30 shadow-soft">Pending</span>
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
        <span className="text-base text-muted">
          {formatDate(new Date(row.original.createdAt!), "MMM dd, yyyy")}
        </span>
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
        <span className="text-base text-muted">
          {formatDate(new Date(row.original.updatedAt!), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <span className="text-base font-semibold text-title">Actions</span>
    ),
    cell: ({ row }) => {
      return <ActionButtons user={row.original} />;
    },
  },
];