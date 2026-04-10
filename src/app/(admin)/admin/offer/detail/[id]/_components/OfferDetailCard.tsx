import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { OfferApplication } from "./types";

interface Props {
  application: OfferApplication;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
}

const OfferDetailCard = (props: Props) => {
  const { application, handleApprove, handleReject } = props;

  return (
    <Card
      key={application.id}
      className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm hover:border-slate-600/50 transition-all"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
        {/* Influencer Info */}
        <div>
          <p className="text-xs uppercase font-semibold text-slate-400 mb-2">
            Influencer
          </p>
          <p className="text-white font-bold text-lg">
            {application.user.name}
          </p>
          <p className="text-slate-400 text-sm">{application.user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase font-semibold text-slate-400 mb-2">
            Status
          </p>
          <div className="flex items-center gap-2">
            {application.isApproved && (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-400 font-semibold">Approved</span>
              </>
            )}
            {application.isPending && (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                <span className="text-yellow-400 font-semibold">Pending</span>
              </>
            )}
            {application.isRejected && (
              <>
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-red-400 font-semibold">Rejected</span>
              </>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400 mb-1">
              Asking Price
            </p>
            <p className="text-white font-bold">${application.askingPrice}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400 mb-1">
              Est. Reach
            </p>
            <p className="text-blue-400 font-semibold">
              {(Number(application.estimatedReach!) / 1000).toFixed(0)}K
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400 mb-1">
              Submitted
            </p>
            <p className="text-white font-semibold">
              {new Date(application.submittedAt!).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold text-slate-400 mb-1">
              Delivery Days
            </p>
            <p className="text-white font-semibold">
              {application.deliveryDays} days
            </p>
          </div>
        </div>
      </div>
      <div className="mb-4 pb-4 border-b border-slate-700/50">
        <p className="text-xs uppercase font-semibold text-slate-400 mb-2">
          Proposal
        </p>
        <p className="text-slate-300 text-sm">{application.proposal}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          {application.reviewedBy && (
            <>
              Reviewed by{" "}
              <span className="text-slate-400 font-medium">
                {application.reviewedBy.name}
              </span>
              {application.adminNotes && (
                <div className="mt-2 p-3 bg-slate-700/50 rounded border border-slate-600 text-slate-300">
                  <p className="text-xs font-semibold mb-1">Notes:</p>
                  <p>{application.adminNotes}</p>
                </div>
              )}
            </>
          )}
        </div>
        {application.isPending && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove(application.id)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 rounded-lg px-4 py-2"
            >
              <Check className="size-4" />
              Approve
            </Button>
            <Button
              onClick={() => handleReject(application.id)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 rounded-lg px-4 py-2"
            >
              <X className="size-4" />
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OfferDetailCard;