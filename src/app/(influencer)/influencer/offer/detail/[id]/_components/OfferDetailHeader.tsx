import { Offer } from "@/app/types";
import { daysRemaining } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  offer: Offer;
}

const OfferDetailHeader = (props: Props) => {
  const { offer } = props;
  return (
    <div className="mb-10 animate-fadeInUp">
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-4xl font-bold text-black tracking-tight">{offer.title}</h1>
        {offer.isApplied && (
          <div className="bg-black text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-soft">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Applied</span>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 rounded-3xl border-2 border-black/5 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-black/5 shadow-sm overflow-hidden">
            <img
              src="/admin.webp"
              alt={offer.createdBy.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Offered by</p>
            <p className="text-lg font-bold text-black">
              {offer.createdBy.name}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right px-4 py-3 bg-yellow-50 rounded-2xl border border-yellow-100">
          <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">Time Remaining</p>
          <p className="text-2xl font-bold text-yellow-700">
            {daysRemaining(offer.endDate)} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailHeader;
