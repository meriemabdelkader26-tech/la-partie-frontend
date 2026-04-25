import { Users, Briefcase, FileText } from "lucide-react";
import { ProfileCompanyFormData } from "../types";
import { companySizes, domainActivities } from "../constants";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyDetail = (props: Props) => {
  const { formData } = props;
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-emerald-500" />
        <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Company Details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Company Size</p>
          </div>
          <p className="text-gray-900 text-sm font-bold ml-5.5">
            {companySizes.find((size) => size.value === formData.size)?.label ||
              formData.size}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Briefcase className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Domain Activity</p>
          </div>
          <p className="text-gray-900 text-sm font-bold ml-5.5">
            {domainActivities.find(
              (domain) => domain.value === formData.domainActivity
            )?.label || formData.domainActivity}
          </p>
        </div>
        
        <div className="space-y-2 sm:col-span-2 pt-2">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Briefcase className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Availability Status</p>
          </div>
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest border border-emerald-100 ml-5.5 shadow-sm">
            {formData.disponibiliteCollaboration?.replace(/_/g, " ")}
          </span>
        </div>

        {formData.description && (
          <div className="space-y-2 sm:col-span-2 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <p className="text-[10px] font-black uppercase tracking-wider">Company Bio / Description</p>
            </div>
            <p className="text-gray-600 text-sm font-medium leading-relaxed italic ml-5.5 bg-white p-4 rounded-2xl border border-black/5 shadow-inner-soft">
              &ldquo;{formData.description}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCompanyDetail;
