import { useCallback, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/app/types";
import { createColumns } from "./TableColumns";
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoriesToDelete, setCategoriesToDelete] = useState<Category[]>([]);
  const [resetSelection, setResetSelection] = useState(false);

  // Callbacks
  const onSelectedRowsChange = useCallback((rows: Category[]) => {
    setSelectedIds(rows.map((item) => item.id.toString()));
  }, []);

  const handleDeleteSelected = useCallback((rows: Category[]) => {
    setCategoriesToDelete(rows);
    setShowDeleteDialog(true);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    setSelectedIds([]);
    setCategoriesToDelete([]);
    setResetSelection(true);
    setTimeout(() => setResetSelection(false), 100);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShowDeleteDialog(open);
    if (!open) {
      setCategoriesToDelete([]);
    }
  }, []);

  const columns = createColumns(orderBy, onOrderChange);

  return (
       <div className="mt-3 w-full">
         <div className="rounded-[16px] shadow-soft bg-white overflow-x-auto">
      {error && <ErrorTriangle message={error} />}

      <DataTable
        onSelectedRowsChange={onSelectedRowsChange}
        onDeleteSelected={handleDeleteSelected}
        paginationProps={paginationProps}
        columns={columns ?? []}
        data={items ?? []}
        isLoading={isLoading}
        moduleColor="hover:bg-primary-light/10"
        ModulePaginationColor="bg-primary"
        resetSelection={resetSelection}
        className="rounded-xl bg-surface border border-muted shadow-soft"
      />
         </div>
      <BatchDeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogOpenChange}
        categories={categoriesToDelete}
        onDeleteSuccess={handleDeleteSuccess}
        setError={setError}
      />
    </div>
  );
}