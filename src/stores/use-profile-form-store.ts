import { ProfileFormData } from "@/app/(influencer)/influencer/complete-profile/_components/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProfileFormState {
  formData: ProfileFormData;
  setFormData: (data: Partial<ProfileFormData>) => void;
  updateFormData: (updates: Partial<ProfileFormData>) => void;
  clearFormData: () => void;
}

const initialFormData: ProfileFormData = {
  instagramUsername: "",
  pseudo: "",
  instagramData: null,
  biography: "",
  localisation: "",
  siteWeb: "",
  disponibiliteCollaboration: "",
  langues: [],
  typeContenu: [],
  reseauxSociaux: [],
  selectedCategories: [],
  centresInteret: [],
  offresCollaboration: [],
  portfolioMedia: [],
  selectedReels: [],
  selectedPosts: [],
  collaborations: [],
  images: [],
};

export const useProfileFormStore = create<ProfileFormState>()(
  persist(
    (set) => ({
      formData: initialFormData,

      setFormData: (data) => set({ formData: { ...initialFormData, ...data } }),

      updateFormData: (updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...updates,
            // Ensure selectedPosts is always an array
            selectedPosts:
              updates.selectedPosts ?? state.formData.selectedPosts ?? [],
          },
        })),

      clearFormData: () => {
        set({ formData: initialFormData });
        // Also clear from localStorage to ensure clean state
        if (typeof window !== "undefined") {
          localStorage.removeItem("profile-form-storage");
        }
      },
    }),
    {
      name: "profile-form-storage",
      version: 1, // Increment version to trigger migration
      partialize: (state) => ({
        formData: state.formData,
      }),
      migrate: (persistedState: any, version: number) => {
        // Ensure selectedPosts exists in persisted state
        if (persistedState && persistedState.formData) {
          return {
            ...persistedState,
            formData: {
              ...persistedState.formData,
              selectedPosts: persistedState.formData.selectedPosts || [],
            },
          };
        }
        return persistedState;
      },
    }
  )
);
