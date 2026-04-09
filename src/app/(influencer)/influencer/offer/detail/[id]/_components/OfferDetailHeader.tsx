import { Offer } from "@/app/types";
import { daysRemaining } from "@/lib/utils";

interface Props {
  offer: Offer;
}

const OfferDetailHeader = (props: Props) => {
  const { offer } = props;
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-white mb-4">{offer.title}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
            <img
              src="/admin.webp"
              alt={offer.createdBy.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Offered by</p>
            <p className="text-lg font-semibold text-white">
              {offer.createdBy.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 mb-1">Time Remaining</p>
          <p className="text-2xl font-bold text-yellow-400">
            {daysRemaining(offer.endDate)} days
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailHeader;
