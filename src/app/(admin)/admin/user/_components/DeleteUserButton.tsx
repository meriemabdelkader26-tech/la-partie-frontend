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
import { User } from "@/app/types";
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";
import { USERS_KEY } from "@/constant";
import { AlertOctagon } from "lucide-react";

interface Props {
  data: User;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const DeleteUserButton = ({ data, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return graphqlClient.request(MUTATION_DELETE_USER, { userId: data.id });
    },
    onSuccess: (data: any) => {
      if (data.deleteUser.success) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
        onOpenChange(false);
      } else {
        toast.error(data.deleteUser.message || "Failed to delete user");
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error("Failed delete user", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border border-gray-100 shadow-2xl rounded-[32px] p-8 sm:max-w-md animate-in fade-in zoom-in-95 duration-300">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-2 shadow-sm border border-rose-100/50">
            <AlertOctagon className="w-10 h-10 text-rose-500" />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-gray-900 text-center tracking-tight">
            Delete User?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-center text-sm font-medium leading-relaxed">
            You are about to permanently remove <br/>
            <span className="font-bold text-gray-900">&ldquo;{data.name}&rdquo;</span>.<br/><br/>
            This action cannot be undone. Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8 flex gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 px-6 h-12 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              mutate();
            }}
            className="flex-1 px-6 h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {isPending ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserButton;

const MUTATION_DELETE_USER = `
mutation deleteUser($userId: ID!) {
  deleteUser(userId: $userId) {
    success
    message
  }
}
`;
