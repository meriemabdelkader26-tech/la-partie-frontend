import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OfferDetailContact = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white">Need Help?</h3>
      <p className="text-sm text-slate-400">
        Contact the brand directly with any questions about the campaign.
      </p>
      <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
        Contact Brand
      </Button>
    </Card>
  );
};

export default OfferDetailContact;
