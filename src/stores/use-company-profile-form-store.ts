import { ProfileCompanyFormData } from "@/app/(company)/company/complete-profile/_components/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyProfileFormState {
  formData: ProfileCompanyFormData;
  setFormData: (data: Partial<ProfileCompanyFormData>) => void;
  updateFormData: (updates: Partial<ProfileCompanyFormData>) => void;
  clearFormData: () => void;
}

const initialFormData: ProfileCompanyFormData = {
  // Basic Information
  companyName: "",
  matricule: "",
  website: "",
  contactEmail: "",

  // Company Details
  size: "" as any,
  entrepriseType: "" as any,
  domainActivity: "" as any,
  description: "",

  // Company Address
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",

  // Languages & Collaboration
  disponibiliteCollaboration: "" as any,
  langues: [],

  // Images & Logos
  imagesLogos: [],
};

export const useCompanyProfileFormStore = create<CompanyProfileFormState>()(
  persist(
    (set) => ({
      formData: initialFormData,

      setFormData: (data) => set({ formData: { ...initialFormData, ...data } }),

      updateFormData: (updates) =>
        set((state) => ({
          formData: {
            ...state.formData,
            ...updates,
            // Ensure arrays are always arrays
            langues: updates.langues ?? state.formData.langues ?? [],
            imagesLogos:
              updates.imagesLogos ?? state.formData.imagesLogos ?? [],
          },
        })),

      clearFormData: () => {
        set({ formData: initialFormData });
        // Also clear from localStorage to ensure clean state
        if (typeof window !== "undefined") {
          localStorage.removeItem("company-profile-form-storage");
        }
      },
    }),
    {
      name: "company-profile-form-storage",
      version: 1,
      partialize: (state) => ({
        formData: state.formData,
      }),
      migrate: (persistedState: any, version: number) => {
        // Ensure arrays exist in persisted state
        if (persistedState && persistedState.formData) {
          return {
            ...persistedState,
            formData: {
              ...persistedState.formData,
              langues: persistedState.formData.langues || [],
              imagesLogos: persistedState.formData.imagesLogos || [],
            },
          };
        }
        return persistedState;
      },
    }
  )
);
