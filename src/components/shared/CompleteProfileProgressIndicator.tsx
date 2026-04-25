import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  step: number;
  steps: {
    number: number;
    slug: string;
    title: string;
    description: string;
  }[];
}

const CompleteProfileProgressIndicator = (pros: Props) => {
  const { step, steps: STEPS } = pros;
  return (
    <div className="mb-12">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((stepItem, idx) => (
            <div key={stepItem.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="relative z-10">
                <div
                  className={cn(
                    "size-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 border-4",
                    step > stepItem.number
                      ? "bg-black border-black text-white shadow-large scale-110"
                      : step === stepItem.number
                      ? "bg-black border-black text-white shadow-large scale-125 animate-pulse"
                      : "bg-white border-black/10 text-gray-400"
                  )}
                >
                  {step > stepItem.number ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : (
                    stepItem.number
                  )}
                </div>
                
                {/* Step Label (Mobile Hidden) */}
                <div className="hidden md:block absolute top-14 left-1/2 -translate-x-1/2 w-24 text-center">
                  <p className={cn(
                    "text-xs font-semibold transition-colors",
                    step >= stepItem.number ? "text-black" : "text-gray-400"
                  )}>
                    {stepItem.title.split(" ")[0]}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {idx < STEPS.length - 1 && (
                <div className="flex-1 relative h-2 mx-3">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div
                    className={cn(
                      "absolute inset-0 bg-black rounded-full transition-all duration-700 ease-out",
                      step > stepItem.number ? "w-full" : "w-0"
                    )}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center pt-6 px-4">
        <div className="inline-block mb-3">
          <span className="px-4 py-1.5 bg-black/5 text-black text-xs font-bold uppercase tracking-wider rounded-full">
            Step {step} of {STEPS.length}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-3 animate-fadeInUp">
          {STEPS[step - 1].title}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-100">
          {STEPS[step - 1].description}
        </p>
      </div>
    </div>
  );
};

export default CompleteProfileProgressIndicator;
