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

  const onSelectedRowsChange = useCallback((rows: Category[]) => {
    setSelectedIds(rows.map((item) => item.id.toString()));
  }, []);

  const onSelectedCardsChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const columns = createColumns(orderBy, onOrderChange);

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

  return (
    <div className="mt-3 w-full">
      {error && <ErrorTriangle message={error} />}

      <DataTable
        onSelectedRowsChange={onSelectedRowsChange}
        onDeleteSelected={handleDeleteSelected}
        paginationProps={paginationProps}
        columns={columns ?? []}
        data={items ?? []}
        isLoading={isLoading}
        moduleColor="hover:bg-emerald-500/10"
        ModulePaginationColor="bg-emerald-500"
        resetSelection={resetSelection}
      />

      <BatchDeleteCategoryDialog
        open={showDeleteDialog}
        onOpenChange={handleDialogOpenChange}
        categoriesToDelete={categoriesToDelete}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}