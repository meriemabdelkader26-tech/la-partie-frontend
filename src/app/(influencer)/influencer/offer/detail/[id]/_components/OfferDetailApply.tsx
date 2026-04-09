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
      <Card className="bg-green-500/10 border-green-500/30 p-6 backdrop-blur-sm">
        {hasApplied ? (
          <div className="text-center py-4">
            <div className="inline-block bg-green-500/20 rounded-full p-3 mb-4">
              <CheckCircle className="size-8 text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Application Submitted
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              The brand will review your application and get back to you soon.
            </p>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 rounded-lg bg-transparent"
            >
              View My Applications
            </Button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-white mb-0">
              Ready to Apply?
            </h3>
            <p className="text-sm text-slate-300 mb-4">
              Make sure your profile matches the requirements before applying.
            </p>
            <Button
              onClick={() => setShowApplyDialog(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-3"
            >
              Apply Now
            </Button>
          </>
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
