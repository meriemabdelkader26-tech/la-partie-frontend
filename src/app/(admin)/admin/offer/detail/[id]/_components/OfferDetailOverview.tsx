import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";
import { daysRemaining } from "@/lib/utils";

interface Props {
  offer: Offer;
}

const OfferDetailOverview = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-8 backdrop-blur-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Objective
          </h2>
          <p className="text-white text-lg mb-6">{offer.objectif}</p>

          <h2 className="text-sm font-semibold text-slate-400 uppercase mb-2">
            Requirements
          </h2>
          <div className="text-white space-y-2 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>1 Instagram Reel</li>
              <li>Tag brand</li>
              <li>Use hashtag</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">
              Budget Range
            </p>
            <p className="text-white font-bold">
              ${offer.minBudget} - ${offer.maxBudget}
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">
              Influencers Needed
            </p>
            <p className="text-white font-bold">{offer.influencerNumber}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">
              Start Date
            </p>
            <p className="text-white font-bold">{offer.startDate}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-2">
              Days Remaining
            </p>
            <p className="text-yellow-400 font-bold">
              {daysRemaining(offer.endDate)} days
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailOverview;