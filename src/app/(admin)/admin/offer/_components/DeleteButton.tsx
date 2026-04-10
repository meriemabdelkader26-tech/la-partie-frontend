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
import { Offer } from "@/app/types";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";
import { OFFERS_KEY } from "@/constant";

interface Props {
  data: Offer;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const DeleteButton = ({ data, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return graphqlClient.request(MUTATION_DELETE_OFFER, { id: data.id });
    },
    onSuccess: (data) => {
      if (data.offerDelete.found) {
        toast.success("Offer deleted successfully");
        queryClient.invalidateQueries({ queryKey: [OFFERS_KEY] });
        onOpenChange(false);
      } else {
        toast.error("Failed to delete offer");
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to delete offer");
      console.error("Failed delete offer", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            This action cannot be undone. This will permanently delete &nbsp;
            <span className="font-semibold text-emerald-400">
              {data.title}
            </span>{" "}
            &nbsp;from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isPending}
            className="py-2 px-4 bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-rose-500 hover:bg-rose-600 text-white py-2 px-4"
            disabled={isPending}
            onClick={() => mutate()}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;

const MUTATION_DELETE_OFFER = `
mutation offerDelete($id: ID!) {
  offerDelete(id: $id) {
    deletedId
    deletedInputId
    deletedRawId
    found
  }
}
`;