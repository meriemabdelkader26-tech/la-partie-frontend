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
import { User } from "@/app/types";

interface Props {
  data: User;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

const VerifyButton = ({ data: user, open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return graphqlClient.request(MUTATION_VERIFY_USER, { userId: user.id });
    },
    onSuccess: (data) => {
      if (data.adminVerifyUser.success) {
        toast.success(
          `${user.name} has been granted platform access and verification status.`
        );
        queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
        onOpenChange(false);
      } else {
        toast.error("Failed to verify user");
        onOpenChange(false);
      }
    },
    onError: (error) => {
      toast.error("Failed to verify user");
      console.error("Failed to verify user", error);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-slate-800 border-slate-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Verify User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            You are about to verify and grant platform access to: &nbsp;
            <span className="font-semibold text-emerald-400">{user.name}</span>
            &nbsp;. Do you wish to proceed? This action cannot be undone.
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
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VerifyButton;

const MUTATION_VERIFY_USER = `
mutation adminVerifyUser($userId: ID!) {
  adminVerifyUser(userId: $userId) {
    user {
      email
      isActive
      isBanned
      name
      role
    }
    message
    success
  }
}
`;