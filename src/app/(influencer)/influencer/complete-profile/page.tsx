"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
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
  // Use Zustand store for form data persistence
  const { formData, updateFormData, clearFormData, currentStep, setCurrentStep } = useProfileFormStore();

  const [stepSlug, setStepSlug] = useQueryState("step", {
    defaultValue: STEPS.find(s => s.number === currentStep)?.slug || "fetching-instagram",
  });

  const { data, isFetching } = useQuery<QueryResponse>({
    queryKey: [CATEGORIES_LIST_KEY],
    queryFn: () => graphqlClient.request(CATEGORIES_QUERY),
  });

  // Get current step number from slug
  const activeStep = getStepBySlug(stepSlug || "fetching-instagram");
  const stepNumber = activeStep?.number || 1;

  // Sync store with URL
  useEffect(() => {
    if (activeStep && activeStep.number !== currentStep) {
      setCurrentStep(activeStep.number);
    }
  }, [activeStep, currentStep, setCurrentStep]);

  // Validate step is within bounds
  useEffect(() => {
    if (!activeStep) {
      setStepSlug(STEPS.find(s => s.number === currentStep)?.slug || "fetching-instagram");
    }
  }, [activeStep, setStepSlug, currentStep]);

  const handleNext = () => {
    if (stepNumber < STEPS.length) {
      const nextStep = STEPS.find((s) => s.number === stepNumber + 1);
      if (nextStep) {
        setStepSlug(nextStep.slug);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (stepNumber > 1) {
      const prevStep = STEPS.find((s) => s.number === stepNumber - 1);
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
    switch (stepNumber) {
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
    <div className="min-h-screen w-full bg-white p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/3 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Badge */}
        <div className="flex justify-center mb-8 animate-fadeInDown">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-black rounded-full text-white font-semibold shadow-large">
            <Sparkles className="w-5 h-5" />
            <span>Complete Your Profile</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="animate-fadeInUp">
          <CompleteProfileProgressIndicator steps={STEPS} step={stepNumber} />
        </div>

        {/* Back Button - Top */}
        {stepNumber > 1 && (
          <div className="flex justify-start mb-6 animate-fadeInUp delay-100">
            <Button
              onClick={handlePrevious}
              className="px-6 py-3 h-12 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-xl border-2 border-black/5 hover:border-black/10 transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white border-2 border-black/5 rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeInUp delay-200 hover:shadow-3xl transition-shadow duration-500">
          <div className="animate-fadeIn">
            {renderStep()}
          </div>
        </div>
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
