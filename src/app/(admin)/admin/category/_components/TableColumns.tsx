"use client";
import { Category } from "@/app/types";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import StatusButton from "./StatusButton";
import ActionsButtons from "./ActionsButtons";
import DescriptionTooltip from "@/components/shared/DescriptionTooltip";
import { formatDate } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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
      className="flex items-center gap-2 text-base font-semibold hover:text-emerald-400 transition-colors"
    >
      {label}
      {isActive ? (
        isAscending ? (
          <ArrowUp className="size-4 text-emerald-400" />
        ) : (
          <ArrowDown className="size-4 text-emerald-400" />
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
): ColumnDef<Category>[] => [
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
        aria-label="Tout sélectionner"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <div className="pl-4 h-full">
        <span
          className={cn(
            "flex origin-center w-2 transition-transform scale-y-0 h-full bg-emerald-500 rounded-r-full absolute left-0 top-0",
            { "scale-y-100": row.getIsSelected() }
          )}
        ></span>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Sélectionner la ligne"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => <span className="text-base font-semibold text-title">ID</span>,
    cell: ({ row }) => <span className="text-base text-text">{row.original.id}</span>,
  },
  {
    accessorKey: "name",
    header: () => (
      <SortableColumnHeader
        label="Category Name"
        field="name"
        currentOrderBy={orderBy}
        onOrderChange={onOrderChange}
      />
    ),
    cell: ({ row }) => {
      return <span className="text-base font-semibold text-title flex items-center gap-2">{row.original.name}</span>;
    },
  },

  {
    accessorKey: "description",
    header: () => <span className="text-base font-semibold text-title">Description</span>,
    cell: ({ row }) => {
      return (
        <span className="text-base text-muted">{row.original.description || '-'}</span>
      );
    },
  },

  //   {
  //     accessorKey: "icon",
  //     header: ({ column }) => (
  //       <div className="text-base">
  //         Icon
  //         <button
  //           onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         ></button>
  //       </div>
  //     ),
  //     cell: ({ row }) => (
  //       <img src={row.original.icon} loading="lazy" className="size-12" />
  //     ),
  //   },
  {
    accessorKey: "isActive",
    header: () => <span className="text-base font-semibold text-title">Active</span>,
    cell: ({ row }) => {
      // Harmonisation badge pill
      return (
        <span className={`text-xs font-semibold px-4 py-1 rounded-full border shadow-sm ${row.original.isActive ? 'bg-[#EAFBF3] text-[#22C55E] border-[#B6EFD7]' : 'bg-[#FFF9E6] text-[#F59E0B] border-[#FDE9B6]'}`} style={{ fontFamily: 'inherit', letterSpacing: 0.2 }}>{row.original.isActive ? 'Active' : 'Inactive'}</span>
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
        <span className="text-base text-muted">
          {formatDate(new Date(row.original.created!), "dd-MM-yyyy HH:mm")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => <span className="text-base font-semibold text-title">Actions</span>,
    cell: ({ row }) => {
      return <ActionsButtons data={row.original} />;
    },
  },
];