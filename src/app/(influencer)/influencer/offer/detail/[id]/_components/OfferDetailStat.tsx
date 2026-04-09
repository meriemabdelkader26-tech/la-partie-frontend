import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailStat = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">Campaign Stats</h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">
            Budget Range
          </p>
          <p className="text-2xl font-bold text-green-400">
            ${offer.minBudget} - ${offer.maxBudget}
          </p>
        </div>
        <div className="bg-slate-700/30 h-px" />
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">
            Influencers Needed
          </p>
          <p className="text-2xl font-bold text-blue-400">
            {offer.influencerNumber}
          </p>
        </div>
        <div className="bg-slate-700/30 h-px" />
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">
            Spots Available
          </p>
          <p className="text-2xl font-bold text-purple-400">
            {/* {offer.spotsLeft} */}
          </p>
        </div>
        <div className="bg-slate-700/30 h-px" />
        <div>
          <p className="text-xs text-slate-400 mb-2 uppercase font-semibold">
            Current Applicants
          </p>
          <p className="text-2xl font-bold text-orange-400">
            {/* {offer.applicants} */}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailStat;
