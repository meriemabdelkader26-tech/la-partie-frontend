import { Offer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { OfferDialogApply } from "./OfferDialogApply";

interface Props {
  offer: Offer;
  hasApplied: boolean;
  onSuccess?: () => void;
}

const OfferDetailApply = (props: Props) => {
  const { offer, hasApplied, onSuccess } = props;
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  return (
    <>
      <Card className="bg-black text-white p-8 rounded-3xl shadow-large border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
        {hasApplied ? (
          <div className="text-center py-4 relative z-10">
            <div className="inline-block bg-white/20 rounded-full p-4 mb-6">
              <CheckCircle className="size-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Application Submitted
            </h3>
            <p className="text-sm text-white/70 mb-8 font-medium">
              The brand will review your application and get back to you soon via messages.
            </p>
            <Button
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white hover:text-black rounded-xl py-6 font-bold transition-all duration-300"
            >
              View My Applications
            </Button>
          </div>
        ) : (
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Apply?
            </h3>
            <p className="text-sm text-white/70 mb-8 font-medium leading-relaxed">
              Make sure your profile matches the requirements before applying for this campaign.
            </p>
            <Button
              onClick={() => setShowApplyDialog(true)}
              className="w-full bg-white hover:bg-gray-100 text-black font-bold py-6 rounded-xl shadow-large transition-all duration-300 hover:scale-[1.02]"
            >
              Apply Now
            </Button>
          </div>
        )}
      </Card>

      <OfferDialogApply
        open={showApplyDialog}
        onOpenChange={setShowApplyDialog}
        offer={offer}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default OfferDetailApply;
