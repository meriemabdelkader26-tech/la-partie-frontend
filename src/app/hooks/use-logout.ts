import { useMutation } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { useSessionStore } from "@/stores/use-session-store";
import { useRouter } from "next/navigation";

const LOGOUT_MUTATION = `
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const useLogout = () => {
  const { signOut } = useSessionStore();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        return await graphqlClient.request(LOGOUT_MUTATION);
      } catch (error) {
        // Even if backend logout fails, we want to clear client side
        console.error("Backend logout failed:", error);
        return { logout: { success: false } };
      }
    },
    onSettled: () => {
      // Always clear client side state
      signOut();
      router.push("/login");
      // Force a full page reload to ensure all states are cleared
      window.location.href = "/login";
    },
  });

  return {
    logout: () => logoutMutation.mutate(),
    isLoading: logoutMutation.isPending,
  };
};
