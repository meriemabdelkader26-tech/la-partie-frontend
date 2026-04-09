"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ReactNode, useEffect, useState } from "react";
import AdvancedPagination from "./advanced-pagination";
import NextAndPreviousButtons from "./next-previous-buttons";
import { DataTableViewOptions } from "./data-table-view-options";

export type DataTableProps<TData> = {
  onSelectedRowsChange?: (rows: TData[]) => void;
  onDeleteSelected?: (rows: TData[]) => void;
  data: TData[];
  columns: ColumnDef<TData>[];
  moduleColor?: string;
  ModulePaginationColor?: string;
  isLoading?: boolean;
  children?: ReactNode;
  showColumnsFilter?: boolean;
  resetSelection?: boolean;
  paginationProps?: {
    advanced?: {
      itemsPerPage: number;
      totalItems: number;
      onPageChange: (page: number) => void;
      pageIndex: number;
    };
    isNextDisabled: boolean;
    isPreviousDisabled: boolean;
    onNextClick: () => void;
    onPreviousClick: () => void;
  };
  getSubRows?: (row: TData) => TData[];
  initialColumnVisibility?: VisibilityState;
};

export function DataTable<TData>({
  showColumnsFilter = false,
  data,
  moduleColor,
  ModulePaginationColor,
  columns,
  paginationProps,
  isLoading = false,
  onSelectedRowsChange,
  onDeleteSelected,
  children,
  getSubRows,
  initialColumnVisibility,
  resetSelection = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility ?? {}
  );
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSubRows,
    onExpandedChange: setExpanded,
    enableRowSelection: true,
    getRowId: (row: any) => row?.id?.toString(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
    },
  });

  useEffect(() => {
    const selectedItems = Object.entries(rowSelection)
      .filter(([_, selected]) => selected)
      .map(([id]) => {
        const row = data.find((item: any) => item?.id?.toString() === id);
        return row as TData;
      })
      .filter(Boolean);

    onSelectedRowsChange?.(selectedItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  // Reset row selection when resetSelection prop changes
  useEffect(() => {
    if (resetSelection) {
      setRowSelection({});
    }
  }, [resetSelection]);

  const selectedRowsCount = Object.keys(rowSelection).length;

  const handleDelete = () => {
    const selectedItems = Object.entries(rowSelection)
      .filter(([_, selected]) => selected)
      .map(([id]) => {
        const row = data.find((item: any) => item?.id?.toString() === id);
        return row as TData;
      })
      .filter(Boolean);

    onDeleteSelected?.(selectedItems);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => {
    const skeletonRows = Array(5).fill(null);
    return (
      <>
        {skeletonRows.map((_, index) => (
          <TableRow key={index} className={`animate-pulse ${moduleColor}`}>
            {columns.map((column, cellIndex) => (
              <TableCell key={cellIndex} className="p-4">
                <div className="flex items-center space-x-2">
                  {column.id === "select" && (
                    <div className="h-5 w-5 rounded bg-emerald-500/20" />
                  )}
                  <div
                    className={cn(
                      "h-8 bg-slate-600/50 mx-auto rounded",
                      column.id === "select"
                        ? "w-0"
                        : column.id === "actions"
                        ? "w-24"
                        : cellIndex % 3 === 0
                        ? "w-24"
                        : cellIndex % 3 === 1
                        ? "w-32"
                        : "w-28"
                    )}
                  />
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  };

  return (
    <div className="">
      {/* Selection bar */}
      {selectedRowsCount > 0 && (
        <div className="mb-2 bg-[#2F365F] border border-[#556B72] rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-[#F7F1ED] font-medium">
            {selectedRowsCount} item{selectedRowsCount > 1 ? "s" : ""} selected
          </span>
          {onDeleteSelected && (
            <button
              onClick={handleDelete}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
      <div className={" flex items-center gap-2 mb-2 justify-end "}>
        {children}
        {showColumnsFilter && (
          <DataTableViewOptions table={table} moduleColor={moduleColor} />
        )}
      </div>
      <div className="rounded-md bg-slate-800 overflow-y-hidden border-slate-700 shadow-lg border">
        <Table>
          <TableHeader className="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn(`transition-colors ${moduleColor}`, {
                  "opacity-50": isLoading,
                })}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-5 text-[#F7F1ED] text-base font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingSkeleton />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(`transition-colors relative ${moduleColor}`, {
                    "bg-emerald-500/20 hover:bg-emerald-500/30":
                      row.getIsSelected(),
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-base text-[#F7F1ED] w-fit"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={`hover:bg-emerald-500/10 ${moduleColor}`}>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[#F7F1ED]/80"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="h-16 border-t border-slate-700 flex">
          <div className="flex items-center justify-between w-full px-5">
            {/* if advanced is not defined the pagination will use next and previous buttons  */}
            {!paginationProps?.advanced && paginationProps && (
              <NextAndPreviousButtons
                className="ml-auto"
                {...paginationProps}
              />
            )}

            {paginationProps?.advanced !== undefined && (
              <AdvancedPagination
                ModulePaginationColor={ModulePaginationColor}
                itemsPerPage={paginationProps.advanced.itemsPerPage}
                totalItems={paginationProps.advanced.totalItems}
                pageIndex={paginationProps.advanced.pageIndex}
                pageCount={Math.ceil(
                  paginationProps.advanced.totalItems /
                    paginationProps.advanced.itemsPerPage
                )}
                onPageChange={paginationProps.advanced.onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
