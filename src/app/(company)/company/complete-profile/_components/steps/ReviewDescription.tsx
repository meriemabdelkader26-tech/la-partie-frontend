import { CheckCircle2 } from "lucide-react";

const ReviewDescription = () => {
  return (
    <div className="bg-linear-to-r from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-6">
      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-medium mb-1">Ready to submit</p>
          <p className="text-slate-400 text-sm">
            All information looks complete. You can edit any section by going
            back, or submit your profile now to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDescription;
