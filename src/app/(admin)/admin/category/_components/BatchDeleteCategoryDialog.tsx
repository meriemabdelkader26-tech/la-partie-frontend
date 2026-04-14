import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient, handleGraphQLError } from "@/lib/graphql-client";
import { CATEGORIES_KEY } from "@/constant";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Category } from "@/app/types";

interface BatchDeleteCategoryMutationResult {
  batchDeleteCategories: {
    deletedIds: string[];
    deletionCount: number;
    missedIds: string[];
  };
}

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoriesToDelete: Category[];
  onSuccess?: () => void;
}

const MUTATION_BATCH_DELETE_CATEGORY = `
  mutation deleteCategory($ids: [ID]!) {
    batchDeleteCategories(ids: $ids) {
      deletedIds
      deletionCount
      missedIds
    }
  }
`;

export function BatchDeleteCategoryDialog({
  open,
  onOpenChange,
  categoriesToDelete = [],
  onSuccess,
}: DeleteCategoryDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    BatchDeleteCategoryMutationResult,
    Error,
    string[]
  >({
    mutationFn: async (ids) => {
      return await graphqlClient.request<BatchDeleteCategoryMutationResult>(
        MUTATION_BATCH_DELETE_CATEGORY,
        { ids }
      );
    },
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
      toast.success("Successfully deleted selected categories!");
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to delete selected categories.");
      console.error("Delete error:", handleGraphQLError(error).message);
    },
  });

  const handleConfirmDelete = () => {
    const ids = categoriesToDelete.map((category) => category.id);
    mutation.mutate(ids);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-semibold text-emerald-400">
              {(categoriesToDelete?.length ?? 0)} categor
              {(categoriesToDelete?.length ?? 0) === 1 ? "y" : "ies"}
            </span>{" "}
            from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={mutation.isPending}
            className="py-2 px-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4"
            disabled={mutation.isPending}
            onClick={handleConfirmDelete}
          >
            {mutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}