import { MapPin } from "lucide-react";
import { ProfileCompanyFormData } from "../types";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyAddress = (props: Props) => {
  const { formData } = props;
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-emerald-500" />
        <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Headquarters Address</p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-inner-soft">
        <p className="text-gray-900 text-sm font-bold leading-relaxed">
          {formData.address}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-gray-600 text-sm font-medium">
            {formData.city}, {formData.state} {formData.postalCode}
          </p>
        </div>
        <p className="text-emerald-600 text-xs font-black uppercase tracking-widest mt-2">
          {formData.country}
        </p>
      </div>
    </div>
  );
};

export default ReviewCompanyAddress;
