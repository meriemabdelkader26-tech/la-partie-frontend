import { useSessionStore } from "@/stores/use-session-store";

export const useUserRole = () => {
  const { currentUser, isLoggedIn } = useSessionStore();

  const isAdmin = currentUser?.isStaff ?? false;
  const isInfluencer = currentUser?.role === "influencer";
  const isCompany = currentUser?.role === "company";
  const role = currentUser?.role;

  return {
    isLoggedIn,
    isAdmin,
    isInfluencer,
    isCompany,
    role,
    user: currentUser,
  };
};
