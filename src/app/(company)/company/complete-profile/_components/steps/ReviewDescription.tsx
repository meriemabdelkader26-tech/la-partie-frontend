import { CheckCircle2, FileCheck } from "lucide-react";

const ReviewDescription = () => {
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 shadow-sm animate-fadeIn">
      <div className="flex gap-4 items-start">
        <div className="bg-emerald-100 p-3 rounded-2xl">
          <FileCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <p className="text-gray-900 font-black text-lg mb-1 uppercase tracking-tight">Ready to launch!</p>
          <p className="text-gray-600 font-medium text-sm leading-relaxed">
            All your company information looks great and is complete. You can review any section by clicking back, or submit your profile now to join the community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDescription;
