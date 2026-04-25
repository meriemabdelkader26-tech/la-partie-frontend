import { Building2, Hash, Globe, Mail } from "lucide-react";
import { ProfileCompanyFormData } from "../types";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyBasicInfo = (props: Props) => {
  const { formData } = props;
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-5 h-5 text-emerald-500" />
        <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Basic Information</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Building2 className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Company Name</p>
          </div>
          <p className="text-gray-900 text-sm font-bold ml-5.5">
            {formData.companyName}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Hash className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Matricule</p>
          </div>
          <p className="text-gray-900 text-sm font-bold ml-5.5">{formData.matricule}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Globe className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Website</p>
          </div>
          <p className="text-emerald-600 text-sm font-bold ml-5.5 truncate">
            {formData.website || "N/A"}
          </p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-3.5 h-3.5" />
            <p className="text-[10px] font-black uppercase tracking-wider">Contact Email</p>
          </div>
          <p className="text-gray-900 text-sm font-bold ml-5.5">
            {formData.contactEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompanyBasicInfo;
