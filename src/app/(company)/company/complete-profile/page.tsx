"use client";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { getStepBySlug, STEPS } from "./_components/constants";
import { ProfileCompanyFormData } from "./_components/types";
import CompleteProfileProgressIndicator from "@/components/shared/CompleteProfileProgressIndicator";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import StepBasicInfo from "./_components/steps/StepBasicInfo";
import StepCompanyDetailsType from "./_components/steps/StepCompanyDetails";
import StepCompanyAddress from "./_components/steps/StepCompanyAddress";
import StepLanguagesCollaboration from "./_components/steps/StepLanguagesCollaboration";
import StepImages from "./_components/steps/StepImages";
import { useCompanyProfileFormStore } from "@/stores/use-company-profile-form-store";
import StepReview from "./_components/steps/StepReview";
import { useRouter } from "next/navigation";

const CompanyCompleteProfile = () => {
  const [stepSlug, setStepSlug] = useQueryState("step", {
    defaultValue: "fetching-instagram",
  });
  const router = useRouter();

  // Use Zustand store for form data persistence
  const { formData, updateFormData, clearFormData } =
    useCompanyProfileFormStore();

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

  const handleUpdateFormData = (updates: Partial<ProfileCompanyFormData>) => {
    updateFormData(updates);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepBasicInfo
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <StepCompanyDetailsType
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <StepCompanyAddress
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <StepLanguagesCollaboration
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <StepImages
            formData={formData}
            onUpdate={handleUpdateFormData}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <StepReview
            formData={formData}
            onComplete={() => router.push("/company/dashboard")}
          />
        );
      default:
        null;
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
};

export default CompanyCompleteProfile;
