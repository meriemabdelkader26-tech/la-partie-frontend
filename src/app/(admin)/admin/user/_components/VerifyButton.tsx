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
import { ShieldCheck } from "lucide-react";

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
    onSuccess: (data: any) => {
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
      <AlertDialogContent className="bg-white border border-gray-100 shadow-2xl rounded-3xl p-6 sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-sm border border-emerald-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <AlertDialogTitle className="text-xl font-extrabold text-gray-900 text-center">
            Approve User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-500 text-center text-sm font-medium leading-relaxed">
            You are about to verify and grant full platform access to <br/>
            <span className="font-bold text-gray-900">{user.name}</span>.<br/><br/>
            Are you sure you want to proceed? This action will notify the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3 sm:justify-center">
          <AlertDialogCancel
            disabled={isPending}
            className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold rounded-xl h-12 shadow-sm transition-all"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl h-12 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Approving..." : "Yes, Approve"}
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