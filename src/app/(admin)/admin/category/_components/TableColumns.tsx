"use client";
import { Category } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ActionsButtons from "./ActionsButtons";
import StatusButton from "./StatusButton";
import { formatDate } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, Tag } from "lucide-react";

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
): ColumnDef<Category>[] => [
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
        label="Category Info"
        field="name"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-3 py-1.5">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
            <Tag className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none">{category.name}</span>
            <span className="text-xs text-gray-500 font-medium mt-1.5 line-clamp-1 max-w-[200px]">
              ID: {category.id}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</span>,
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-gray-500 line-clamp-2 max-w-xs">
          {row.original.description || <span className="italic text-gray-400">No description provided</span>}
        </span>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: () => <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</span>,
    cell: ({ row }) => {
      return (
        <StatusButton id={row.original.id} isActive={row.original.isActive} />
      );
    },
  },
  {
    accessorKey: "created",
    header: () => (
      <SortableColumnHeader
        label="Created At"
        field="created"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="text-sm font-medium text-gray-500">
          {formatDate(new Date(row.original.created!), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</span>,
    cell: ({ row }) => {
      return <ActionsButtons data={row.original} />;
    },
  },
];