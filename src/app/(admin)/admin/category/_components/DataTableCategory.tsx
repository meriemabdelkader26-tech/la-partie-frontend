"use client";

import { useCallback, useState } from "react";
import { Category } from "@/app/types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createColumns } from "./TableColumns";
import { cn } from "@/lib/utils";
import AdvancedPagination from "@/components/ui/advanced-pagination";
import ErrorTriangle from "@/components/shared/ErrorTriangle";
import { BatchDeleteCategoryDialog } from "./BatchDeleteCategoryDialog";

type Props = {
  items: Category[] | undefined;
  isLoading: boolean;
  orderBy: string;
  onOrderChange: (orderBy: string) => void;
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
};

export default function DataTableCategory({
  items,
  paginationProps,
  isLoading,
  orderBy,
  onOrderChange,
}: Props) {
  const [rowSelection, setRowSelection] = useState({});
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoriesToDelete, setCategoriesToDelete] = useState<Category[]>([]);

  // Callbacks
  const handleDeleteSelected = useCallback(() => {
    const selectedCategories = items?.filter((_, index) => rowSelection[index]) || [];
    setCategoriesToDelete(selectedCategories);
    setShowDeleteDialog(true);
  }, [items, rowSelection]);

  const handleDeleteSuccess = useCallback(() => {
    setRowSelection({});
    setCategoriesToDelete([]);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      setCategoriesToDelete([]);
    }
  }, []);

  const columns = createColumns(orderBy, onOrderChange);

  const table = useReactTable({
    data: items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <div className="w-full flex flex-col gap-4">
      {error && <ErrorTriangle message={error} />}

      {/* Batch Actions Bar (Floating) */}
      {selectedRowsCount > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm animate-in slide-in-from-top-2">
          <span className="text-emerald-800 font-bold text-sm">
            {selectedRowsCount} categor{selectedRowsCount > 1 ? "ies" : "y"} selected
          </span>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
              Export Selected
            </button>
            <button 
              onClick={handleDeleteSelected}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table Headers */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50/80 border border-gray-100 rounded-2xl mb-1 sticky top-0 z-10 backdrop-blur-md">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => {
            let colSpanClass = "col-span-1";
            if (header.id === "name") colSpanClass = "col-span-3";
            else if (header.id === "description") colSpanClass = "col-span-3";
            else if (header.id === "isActive") colSpanClass = "col-span-2";
            else if (header.id === "created") colSpanClass = "col-span-2";
            else if (header.id === "actions") colSpanClass = "col-span-1 flex justify-end";

            if (header.id === "select") {
              return (
                <div key={header.id} className="col-span-1 flex items-center">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              );
            }

            return (
              <div key={header.id} className={cn("flex items-center", colSpanClass)}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </div>
            );
          })
        )}
      </div>

      {/* Table Body (Floating Rows) */}
      <div className="flex flex-col gap-3 relative min-h-[400px]">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 lg:px-6 lg:py-4 shadow-sm flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-100 rounded w-48"></div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex gap-16">
                <div className="h-6 w-48 bg-gray-100 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-100 rounded-md"></div>
                <div className="h-6 w-24 bg-gray-100 rounded-md"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))
        ) : table.getRowModel().rows?.length > 0 ? (
          // Actual Rows
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "group bg-white border border-gray-100 rounded-2xl p-4 lg:px-6 lg:py-3 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center relative overflow-hidden",
                row.getIsSelected() && "bg-emerald-50/50 border-emerald-200 shadow-md ring-1 ring-emerald-500/20"
              )}
            >
              {/* Green selection accent bar on left */}
              {row.getIsSelected() && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
              )}

              {row.getVisibleCells().map((cell) => {
                let colSpanClass = "col-span-1";
                if (cell.column.id === "name") colSpanClass = "col-span-3";
                else if (cell.column.id === "description") colSpanClass = "col-span-3";
                else if (cell.column.id === "isActive") colSpanClass = "col-span-2";
                else if (cell.column.id === "created") colSpanClass = "col-span-2";
                else if (cell.column.id === "actions") colSpanClass = "col-span-1 flex justify-end";

                if (cell.column.id === "select") {
                  return (
                    <div key={cell.id} className="col-span-1 flex items-center lg:mb-0 mb-3 z-10">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  );
                }

                // Render specific cell formats on mobile vs desktop
                return (
                  <div 
                    key={cell.id} 
                    className={cn(
                      "flex items-center", 
                      colSpanClass,
                      // On mobile, stack them. On desktop, use grid.
                      "lg:mt-0 mt-2 lg:static relative"
                    )}
                  >
                    {/* Mobile Label */}
                    <span className="lg:hidden text-xs font-bold text-gray-400 uppercase w-28 flex-shrink-0">
                      {cell.column.id === "name" ? "" : cell.column.id}
                    </span>
                    
                    <div className={cn("flex-1", cell.column.id === "actions" ? "flex justify-end" : "")}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          // Empty State
          <div className="bg-white border border-gray-100 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No categories found</h3>
            <p className="text-gray-500 text-sm max-w-sm">We couldn&apos;t find any categories matching your current filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{items?.length || 0}</span> categories
          </div>
          
          <div className="flex items-center gap-2">
            {paginationProps?.advanced && (
              <AdvancedPagination
                ModulePaginationColor="bg-emerald-500"
                itemsPerPage={paginationProps.advanced.itemsPerPage}
                totalItems={paginationProps.advanced.totalItems}
                pageIndex={paginationProps.advanced.pageIndex}
                pageCount={Math.ceil(
                  paginationProps.advanced.totalItems / paginationProps.advanced.itemsPerPage
                )}
                onPageChange={paginationProps.advanced.onPageChange}
              />
            )}
          </div>
        </div>
      )}

      <BatchDeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogOpenChange}
        categories={categoriesToDelete}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}