import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import {
  COOKIE_REFRESH_TOKEN_KEY,
  COOKIE_TOKEN_KEY,
  COOKIE_USER_ROLE_KEY,
} from "@/config";

interface SessionUser {
  email: string;
  name?: string;
  exp: number;
  id: string;
  role?: string;
  isStaff?: boolean;
  isVerifyByAdmin?: boolean;
  isCompletedProfile?: boolean;
  profilePicture?: string;
}

interface SessionState {
  isLoggedIn: boolean;
  currentUser: SessionUser | null;
  setLoggedIn: (value: boolean) => void;
  setCurrentUser: (user: SessionUser | null) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      currentUser: null,
      setLoggedIn: (value) => set({ isLoggedIn: value }),
      setCurrentUser: (user) => set({ currentUser: user }),
      signOut: () => {
        Cookies.remove(COOKIE_TOKEN_KEY);
        Cookies.remove(COOKIE_USER_ROLE_KEY);
        Cookies.remove("isStaff");
        Cookies.remove(COOKIE_REFRESH_TOKEN_KEY);

        // Clear session state
        set({ isLoggedIn: false, currentUser: null });

        // Clear all localStorage items related to the app
        if (typeof window !== "undefined") {
          localStorage.removeItem("session-storage");
          localStorage.removeItem("profile-form-storage");
          localStorage.removeItem("company-profile-form-storage");
        }
      },
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        currentUser: state.currentUser,
      }),
    }
  )
);
