import { Offer } from "@/app/types";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailOverview = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft">
      <h2 className="text-xl font-bold text-black mb-6">Campaign Overview</h2>
      <p className="text-gray-600 leading-relaxed mb-8 font-medium">
        We are looking for talented influencers to help us create engaging
        content for our new product launch. This is a great opportunity to
        collaborate with a leading brand and showcase your creative skills to a
        wider audience.
      </p>
      <div className="grid gap-6">
        <div className="bg-gray-50 border border-black/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Objective
          </p>
          <p className="text-black font-bold text-lg">{offer.objectif}</p>
        </div>
        <div className="bg-gray-50 border border-black/5 rounded-2xl p-6">
          <p className="text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
            Campaign Duration
          </p>
          <p className="text-black font-bold text-lg">
            {offer.startDate} - {offer.endDate}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default OfferDetailOverview;
