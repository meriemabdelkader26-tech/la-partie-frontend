"use client";
import { useQueryState } from "nuqs";
import { useEffect } from "react";
import { getStepBySlug, STEPS } from "./_components/constants";
import { ProfileCompanyFormData } from "./_components/types";
import CompleteProfileProgressIndicator from "@/components/shared/CompleteProfileProgressIndicator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
import StepBasicInfo from "./_components/steps/StepBasicInfo";
import StepCompanyDetails from "./_components/steps/StepCompanyDetails";
import StepCompanyAddress from "./_components/steps/StepCompanyAddress";
import StepLanguagesCollaboration from "./_components/steps/StepLanguagesCollaboration";
import StepImages from "./_components/steps/StepImages";
import { useCompanyProfileFormStore } from "@/stores/use-company-profile-form-store";
import StepReview from "./_components/steps/StepReview";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const CompanyCompleteProfile = () => {
  // Use Zustand store for form data persistence
  const { formData, updateFormData, clearFormData, currentStep, setCurrentStep } =
    useCompanyProfileFormStore();

  const [stepSlug, setStepSlug] = useQueryState("step", {
    defaultValue: STEPS.find(s => s.number === currentStep)?.slug || "basic-info",
  });
  const router = useRouter();

  // Get current step number from slug
  const activeStep = getStepBySlug(stepSlug || "basic-info");
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
      setStepSlug(STEPS.find(s => s.number === currentStep)?.slug || "basic-info");
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

  const handleUpdateFormData = (updates: Partial<ProfileCompanyFormData>) => {
    updateFormData(updates);
  };

  const renderStep = () => {
    switch (stepNumber) {
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
          <StepCompanyDetails
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
    <div className="min-h-screen w-full bg-white p-4 md:p-8 relative overflow-hidden">
      {/* ... existing background elements ... */}
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
            <span>Complete Company Profile</span>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={stepNumber}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="animate-fadeIn"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CompanyCompleteProfile;
