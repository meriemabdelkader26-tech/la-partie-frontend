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
import { graphqlClient } from "@/lib/graphql-client";
import { toast } from "sonner";
import { USERS_KEY } from "@/constant";
import { AlertOctagon } from "lucide-react";

interface Props {
  userIds: string[];
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onSuccess: () => void;
}

const BulkDeleteUsersButton = ({ userIds, open, onOpenChange, onSuccess }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return graphqlClient.request(MUTATION_BULK_DELETE_USERS, { userIds });
    },
    onSuccess: (data: any) => {
      if (data.bulkDeleteUsers.success) {
        toast.success(data.bulkDeleteUsers.message || "Users deleted successfully");
        queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
        onSuccess();
        onOpenChange(false);
      } else {
        toast.error(data.bulkDeleteUsers.message || "Failed to delete users");
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to delete users");
      console.error("Failed bulk delete users", error);
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
            Delete Selected Users?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-center text-sm font-medium leading-relaxed">
            You are about to permanently remove <span className="font-bold text-gray-900">{userIds.length}</span> selected users.<br/><br/>
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
            {isPending ? "Deleting..." : "Yes, Delete All"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkDeleteUsersButton;

const MUTATION_BULK_DELETE_USERS = `
mutation bulkDeleteUsers($userIds: [ID!]!) {
  bulkDeleteUsers(userIds: $userIds) {
    success
    message
    deletedCount
  }
}
`;
