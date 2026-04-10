import { Card } from "@/components/ui/card";
import OfferDetailCard from "./OfferDetailCard";
import { OfferApplication } from "./types";

interface Props {
  applications: OfferApplication[];
  handleApprove: (applicationId: string) => void;
  handleReject: (applicationId: string) => void;
}

const OfferDetailDataView = (props: Props) => {
  const { applications, handleApprove, handleReject } = props;
  return (
    <div className="space-y-4">
      {applications.length > 0 ? (
        applications.map((application) => (
          <OfferDetailCard
            key={application.id}
            application={application}
            handleApprove={handleApprove}
            handleReject={handleReject}
          />
        ))
      ) : (
        <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center backdrop-blur-sm">
          <p className="text-slate-400 text-lg">No applications found</p>
          <p className="text-slate-500 text-sm mt-2">
            Try adjusting your search or filters
          </p>
        </Card>
      )}
    </div>
  );
};

export default OfferDetailDataView;