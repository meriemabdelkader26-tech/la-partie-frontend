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
import { AlertOctagon } from "lucide-react";

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
  categories: Category[];
  onDeleteSuccess?: () => void;
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
  categories = [],
  onDeleteSuccess,
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
      onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error("Failed to delete selected categories.");
      console.error("Delete error:", handleGraphQLError(error).message);
    },
  });

  const handleConfirmDelete = () => {
    const ids = categories.map((category) => category.id);
    mutation.mutate(ids);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2 shadow-sm border border-rose-100">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold text-gray-900 text-center">
            Delete Selected Categories
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-center text-sm font-medium leading-relaxed">
            You are about to permanently delete{" "}
            <span className="font-bold text-gray-900">
              {(categories?.length ?? 0)} categor
              {(categories?.length ?? 0) === 1 ? "y" : "ies"}
            </span>{" "}
            from the database.<br/><br/>
            This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={mutation.isPending}
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl h-12 shadow-sm transition-all m-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-12 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 m-0"
            disabled={mutation.isPending}
            onClick={handleConfirmDelete}
          >
            {mutation.isPending ? "Deleting..." : "Yes, Delete All"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}