import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";
import { daysRemaining } from "@/lib/utils";
import { Target, ListChecks, Wallet, Users, Calendar, Clock, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  offer: Offer;
}

const OfferDetailOverview = (props: Props) => {
  const { offer } = props;
  const remainingDays = daysRemaining(offer.endDate);
  const isUrgent = remainingDays <= 7;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl" />
      
      <div className="relative z-10 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Campaign Objective
                </h2>
              </div>
              <p className="text-xl font-bold text-gray-900 leading-relaxed italic">
                &ldquo;{offer.objectif}&rdquo;
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  Requirements
                </h2>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <ul className="space-y-3">
                  {(offer.requirement || "No specific requirements listed.").split('\n').map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-gray-600 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <Wallet className="w-5 h-5 text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Budget Range
              </p>
              <p className="text-lg font-black text-gray-900 leading-tight">
                ${Number(offer.minBudget).toLocaleString()} - <br/>
                ${Number(offer.maxBudget).toLocaleString()}
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <Users className="w-5 h-5 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Open Slots
              </p>
              <p className="text-2xl font-black text-gray-900">
                {offer.influencerNumber}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Influencers</p>
            </div>

            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <Calendar className="w-5 h-5 text-amber-500 mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Starts On
              </p>
              <p className="text-lg font-black text-gray-900">
                {new Date(offer.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className={cn(
              "p-6 rounded-2xl shadow-sm hover:shadow-md transition-all group border",
              isUrgent ? "bg-rose-50 border-rose-100" : "bg-white border-gray-100"
            )}>
              <Clock className={cn("w-5 h-5 mb-3 group-hover:scale-110 transition-transform", isUrgent ? "text-rose-500" : "text-gray-400")} />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Time Left
              </p>
              <p className={cn("text-2xl font-black", isUrgent ? "text-rose-600" : "text-gray-900")}>
                {remainingDays}d
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Until Expiration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailOverview;
