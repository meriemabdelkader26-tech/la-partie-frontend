import { Offer } from "@/app/types";
import Preview from "@/components/shared/Preview";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailRequirements = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft">
      <h2 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
        Requirements
      </h2>
      <div className="bg-white border-2 border-black/5 rounded-2xl p-4 sm:p-6 overflow-hidden">
        <Preview 
          value={offer.requirement} 
          className="text-gray-700 font-medium leading-relaxed"
        />
      </div>
    </Card>
  );
};

export default OfferDetailRequirements;
