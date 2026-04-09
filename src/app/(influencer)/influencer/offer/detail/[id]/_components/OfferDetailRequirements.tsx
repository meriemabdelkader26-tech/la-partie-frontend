import { Offer } from "@/app/types";
import Preview from "@/components/shared/Preview";
import { Card } from "@/components/ui/card";

interface Props {
  offer: Offer;
}

const OfferDetailRequirements = (props: Props) => {
  const { offer } = props;
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-white mb-4">Requirements</h2>
      <Preview value={offer.requirement} />
    </Card>
  );
};

export default OfferDetailRequirements;
