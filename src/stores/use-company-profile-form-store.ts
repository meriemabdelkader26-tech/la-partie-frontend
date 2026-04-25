import { ProfileCompanyFormData } from "@/app/(company)/company/complete-profile/_components/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompanyProfileFormState {
  formData: ProfileCompanyFormData;
  currentStep: number;
  setFormData: (data: Partial<ProfileCompanyFormData>) => void;
  updateFormData: (updates: Partial<ProfileCompanyFormData>) => void;
  setCurrentStep: (step: number) => void;
  clearFormData: () => void;
}

const initialFormData: ProfileCompanyFormData = {
  // ... Basic Information
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
      currentStep: 1,

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

      setCurrentStep: (step) => set({ currentStep: step }),

      clearFormData: () => {
        set({ formData: initialFormData, currentStep: 1 });
        // Also clear from localStorage to ensure clean state
        if (typeof window !== "undefined") {
          localStorage.removeItem("company-profile-form-storage");
        }
      },
    }),
    {
      name: "company-profile-form-storage",
      version: 2,
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
      migrate: (persistedState: any, version: number) => {
        // Ensure arrays exist in persisted state
        if (persistedState && persistedState.formData) {
          return {
            ...persistedState,
            currentStep: persistedState.currentStep || 1,
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
