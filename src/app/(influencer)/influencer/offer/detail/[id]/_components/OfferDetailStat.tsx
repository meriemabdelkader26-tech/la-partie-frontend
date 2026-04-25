import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailStat = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft">
      <h3 className="text-lg font-bold text-black mb-6 uppercase tracking-wider text-xs opacity-60">Campaign Stats</h3>
      <div className="space-y-6">
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Budget Range
          </p>
          <p className="text-2xl font-bold text-green-600">
            ${offer.minBudget} - ${offer.maxBudget}
          </p>
        </div>
        <div className="bg-black/5 h-0.5 w-full" />
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Influencers Needed
          </p>
          <p className="text-2xl font-bold text-black">
            {offer.influencerNumber}
          </p>
        </div>
        <div className="bg-black/5 h-0.5 w-full" />
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Spots Available
          </p>
          <p className="text-2xl font-bold text-black">
            {Math.max(0, offer.influencerNumber - (offer.approvedApplicationsCount || 0))}
          </p>
        </div>
        <div className="bg-black/5 h-0.5 w-full" />
        <div>
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Current Applicants
          </p>
          <p className="text-2xl font-bold text-black">
            {offer.applicationsCount || 0}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailStat;
