import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailOverview = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Campaign Overview</h2>
      <p className="text-slate-300 leading-relaxed mb-2">
        We are looking for talented influencers to help us create engaging
        content for our new product launch. This is a great opportunity to
        collaborate with a leading brand and showcase your creative skills to a
        wider audience.
      </p>
      <div className="flex flex-col gap-4">
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">
            Objective
          </p>
          <p className="text-white font-medium">{offer.objectif}</p>
        </div>
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1 uppercase font-semibold">
            Campaign Duration
          </p>
          <p className="text-white font-medium">
            {offer.startDate} - {offer.endDate}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailOverview;
