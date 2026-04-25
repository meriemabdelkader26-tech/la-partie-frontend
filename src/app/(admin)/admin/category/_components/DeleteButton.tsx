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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "@/app/types";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";
import { CATEGORIES_KEY } from "@/constant";
import { AlertOctagon } from "lucide-react";

interface Props {
  data: Category;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const DeleteButton = ({ data, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return graphqlClient.request(MUTATION_DELETE_CATEGORY, { id: data.id });
    },
    onSuccess: (data: { deleteCategory: { found: boolean } }) => {
      if (data.deleteCategory.found) {
        toast.success("Category deleted successfully");
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
        onOpenChange(false);
      } else {
        toast.error("Failed to delete category");
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to delete category");
      console.error("Failed delete category", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-2 shadow-sm border border-rose-100">
            <AlertOctagon className="w-8 h-8 text-rose-500" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold text-gray-900 text-center">
            Delete Category
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-center text-sm font-medium leading-relaxed">
            You are about to permanently delete the category <br/>
            <span className="font-bold text-gray-900">{data.name}</span>.<br/><br/>
            This action cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl h-12 shadow-sm transition-all m-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl h-12 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 m-0"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;

const MUTATION_DELETE_CATEGORY = `
mutation deleteCategory($id: ID!) {
  deleteCategory(id: $id) {
    deletedId
    deletedInputId
    deletedRawId
    found
  }
}
`;