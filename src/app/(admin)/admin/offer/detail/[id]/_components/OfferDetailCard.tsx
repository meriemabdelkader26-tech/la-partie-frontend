import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, User, DollarSign, BarChart3, Clock, FileText, ShieldCheck } from "lucide-react";
import { OfferApplication } from "./types";
import { cn } from "@/lib/utils";

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
      className="group bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              {application.user.influencerProfile?.profilePicture ? (
                <img
                  src={application.user.influencerProfile.profilePicture}
                  alt={application.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-7 h-7 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">
                {application.user.name}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {application.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={cn(
              "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
              application.isApproved && "bg-emerald-50 text-emerald-700 border-emerald-100",
              application.isPending && "bg-amber-50 text-amber-700 border-amber-100",
              application.isRejected && "bg-rose-50 text-rose-700 border-rose-100"
            )}>
              {application.status}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Asking Price</span>
            </div>
            <p className="text-xl font-black text-gray-900">${application.askingPrice?.toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Est. Reach</span>
            </div>
            <p className="text-xl font-black text-blue-600">
              {(Number(application.estimatedReach!) / 1000).toFixed(0)}K
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Delivery</span>
            </div>
            <p className="text-xl font-black text-gray-900">{application.deliveryDays} Days</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-gray-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Submitted</span>
            </div>
            <p className="text-sm font-bold text-gray-700">
              {new Date(application.submittedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Proposal Message</span>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
            &ldquo;{application.proposal}&rdquo;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {application.reviewedBy && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">
                  Reviewed by {application.reviewedBy.name}
                </span>
              </div>
            )}
          </div>

          {application.isPending && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleReject(application.id)}
                variant="outline"
                className="h-10 px-6 border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-bold rounded-xl transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={() => handleApprove(application.id)}
                className="h-10 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <Check className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>

        {application.adminNotes && (
          <div className="mt-6 p-4 bg-amber-50/30 rounded-xl border border-amber-100/50">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Admin Notes</p>
            <p className="text-sm font-medium text-amber-800/80">{application.adminNotes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OfferDetailCard;
