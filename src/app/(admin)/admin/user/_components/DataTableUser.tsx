import { useCallback, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Category, User } from "@/app/types";
import { createColumns } from "./TableColumns";

type Props = {
  items: User[] | undefined;
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

  const onSelectedRowsChange = useCallback((rows: Category[]) => {
    setSelectedIds(rows.map((item) => item.id.toString()));
  }, []);

  const columns = createColumns(orderBy, onOrderChange);

  return (
    <div className="mt-3 w-full">
      <DataTable
        onSelectedRowsChange={onSelectedRowsChange}
        paginationProps={paginationProps}
        columns={columns ?? []}
        data={items ?? []}
        isLoading={isLoading}
        moduleColor="hover:bg-emerald-500/10"
        ModulePaginationColor="bg-emerald-500"
      />
    </div>
  );
}