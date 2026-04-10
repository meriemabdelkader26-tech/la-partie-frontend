import { Card } from "@/components/ui/card";
import { Check, Clock, Users, X } from "lucide-react";

interface Props {
  applications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

const OfferDetailStats = (props: Props) => {
  const { applications, pendingCount, approvedCount, rejectedCount } = props;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">
              Total Applications
            </p>
            <p className="text-3xl font-bold text-white mt-2">{applications}</p>
          </div>
          <Users className="size-6 text-green-400" />
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {pendingCount}
            </p>
          </div>
          <Clock className="size-6 text-yellow-400" />
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Approved</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {approvedCount}
            </p>
          </div>
          <Check className="size-6 text-green-400" />
        </div>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700/50 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Rejected</p>
            <p className="text-3xl font-bold text-red-400 mt-2">
              {rejectedCount}
            </p>
          </div>
          <X className="size-6 text-red-400" />
        </div>
      </Card>
    </div>
  );
};

export default OfferDetailStats;