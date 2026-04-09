"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { ProfileFormData } from "./_components/types";
import { STEPS, getStepBySlug } from "./_components/constants";
import CompleteProfileProgressIndicator from "../../../../components/shared/CompleteProfileProgressIndicator";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES_LIST_KEY } from "@/constant";
import { Category } from "@/app/types";
import { graphqlClient } from "@/lib/graphql-client";
import StepCategories from "./_components/steps/StepCategories";
import StepInstagram from "./_components/steps/StepInstagram";
import StepReview from "./_components/steps/StepReview";
import StepPortfolio from "./_components/steps/StepPortfolio";
import StepInstagramPosts from "./_components/steps/StepInstagramPosts";
import StepCollaboration from "./_components/steps/StepCollaboration";
import StepSocialNetworks from "./_components/steps/StepSocialNetworks";
import StepLanguages from "./_components/steps/StepLanguages";
import StepPersonalInfo from "./_components/steps/StepPersonalInfo";
import StepImages from "./_components/steps/StepImages";
import { useProfileFormStore } from "@/stores/use-profile-form-store";

const CATEGORIES_QUERY = `
query allCategories($isActive: Boolean) {
  allCategories(isActive: $isActive) {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}
`;

export default function CompleteProfilePage() {
  const router = useRouter();
  const [stepSlug, setStepSlug] = useQueryState("step", {
    defaultValue: "fetching-instagram",
  });

  const { data, isFetching } = useQuery<QueryResponse>({
    queryKey: [CATEGORIES_LIST_KEY],
    queryFn: () => graphqlClient.request(CATEGORIES_QUERY),
  });

  // Use Zustand store for form data persistence
  const { formData, updateFormData, clearFormData } = useProfileFormStore();

  // Get current step number from slug
  const currentStep = getStepBySlug(stepSlug || "fetching-instagram");
  const step = currentStep?.number || 1;

  // Validate step is within bounds
  useEffect(() => {
    if (!currentStep) {
      setStepSlug("fetching-instagram");
    }
  }, [currentStep, setStepSlug]);

  const handleNext = () => {
    if (step < STEPS.length) {
      const nextStep = STEPS.find((s) => s.number === step + 1);
      if (nextStep) {
        setStepSlug(nextStep.slug);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      const prevStep = STEPS.find((s) => s.number === step - 1);
      if (prevStep) {
        setStepSlug(prevStep.slug);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdateFormData = (updates: Partial<ProfileFormData>) => {
    updateFormData(updates);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepInstagram
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepInstagramPosts
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <StepPersonalInfo
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <StepLanguages
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <StepSocialNetworks
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <StepCategories
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
            categories={data?.allCategories.edges.map((edge) => edge.node)}
            isFetchingCategories={isFetching}
          />
        );
      case 7:
        return (
          <StepCollaboration
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 8:
        return (
          <StepPortfolio
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 9:
        return (
          <StepImages
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 10:
        return (
          <StepReview
            categories={data?.allCategories.edges.map((edge) => edge.node)}
            formData={formData}
            onComplete={() => router.push("/influencer")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <CompleteProfileProgressIndicator steps={STEPS} step={step} />
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
          {renderStep()}
        </div>
        {step > 1 && (
          <div className="flex justify-start">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-white/10 hover:text-white bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export type QueryResponse = {
  allCategories: {
    edges: Array<{
      node: Category;
    }>;
  };
};
