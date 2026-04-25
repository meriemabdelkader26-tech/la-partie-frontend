import { Card } from "@/components/ui/card";
import OfferDetailCard from "./OfferDetailCard";
import { OfferApplication } from "./types";
import { SearchX } from "lucide-react";

interface Props {
  applications: OfferApplication[];
  handleApprove: (applicationId: string) => void;
  handleReject: (applicationId: string) => void;
}

const OfferDetailDataView = (props: Props) => {
  const { applications, handleApprove, handleReject } = props;
  
  if (applications.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-100 border-dashed rounded-[24px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm">
          <SearchX className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">No applications yet</h3>
        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
          There are currently no submissions for this offer. Check back later or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {applications.map((application) => (
        <OfferDetailCard
          key={application.id}
          application={application}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      ))}
    </div>
  );
};

export default OfferDetailDataView;
