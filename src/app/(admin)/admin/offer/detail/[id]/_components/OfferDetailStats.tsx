import { Card } from "@/components/ui/card";
import { Check, Clock, Users, X, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const OfferDetailStats = (props: Props) => {
  const { total, pending, approved, rejected } = props;
  
  const stats = [
    { label: "Total Applications", value: total, icon: Users, color: "blue" },
    { label: "Pending Review", value: pending, icon: Clock, color: "amber" },
    { label: "Approved", value: approved, icon: Check, color: "emerald" },
    { label: "Rejected", value: rejected, icon: X, color: "rose" },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50">
          <Activity className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Application Stats</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-md hover:border-gray-200 group">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                stat.color === "blue" && "bg-blue-50 text-blue-500 border border-blue-100",
                stat.color === "amber" && "bg-amber-50 text-amber-500 border border-amber-100",
                stat.color === "emerald" && "bg-emerald-50 text-emerald-500 border border-emerald-100",
                stat.color === "rose" && "bg-rose-50 text-rose-500 border border-rose-100",
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
            </div>
            <span className={cn(
              "text-2xl font-black transition-colors",
              stat.color === "blue" && "text-blue-600",
              stat.color === "amber" && "text-amber-600",
              stat.color === "emerald" && "text-emerald-600",
              stat.color === "rose" && "text-rose-600",
            )}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferDetailStats;
