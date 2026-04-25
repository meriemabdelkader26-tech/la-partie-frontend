import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const OfferDetailContact = () => {
  return (
    <Card className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft">
      <h3 className="text-xl font-bold text-black mb-2">Need Help?</h3>
      <p className="text-sm text-gray-500 font-medium mb-6">
        Contact the brand directly with any questions about the campaign.
      </p>
      <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-xl py-6 font-bold shadow-soft transition-all duration-300">
        Contact Brand
      </Button>
    </Card>
  );
};

export default OfferDetailContact;
