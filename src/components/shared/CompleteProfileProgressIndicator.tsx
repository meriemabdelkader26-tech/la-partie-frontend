import { cn } from "@/lib/utils";

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
    <div className="mb-8 mt-6">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((stepItem, idx) => (
          <div key={stepItem.number} className="flex items-center flex-1">
            <div
              className={cn(
                "size-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                step >= stepItem.number
                  ? "bg-primary text-white"
                  : "bg-slate-700 text-slate-400"
              )}
            >
              {stepItem.number}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-1 mx-2 transition-colors",
                  step > stepItem.number ? "bg-primary" : "bg-slate-700"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold text-white mb-1">
          {STEPS[step - 1].title}
        </h1>
        <p className="text-slate-400">{STEPS[step - 1].description}</p>
        <p className="text-sm text-slate-500 mt-2">
          Step {step} of {STEPS.length}
        </p>
      </div>
    </div>
  );
};

export default CompleteProfileProgressIndicator;
