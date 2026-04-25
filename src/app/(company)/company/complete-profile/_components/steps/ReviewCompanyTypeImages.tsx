import IconHeader from "@/components/shared/IconHeader";
import { ProfileCompanyFormData } from "../types";
import { Building2, Image as ImageIcon } from "lucide-react";
import { enterpriseTypes } from "../constants";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyTypeImages = (props: Props) => {
  const { formData } = props;
  return (
    <div className="space-y-6 animate-fadeIn">
      {formData.imagesLogos && formData.imagesLogos.length > 0 && (
        <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-emerald-500" />
            <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Company Logo & Media</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.imagesLogos.map((img, index) => (
              <div
                className="bg-white border border-black/5 rounded-2xl p-2 flex items-center justify-center aspect-square shadow-soft overflow-hidden"
                key={index}
              >
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Company Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-emerald-500" />
          <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Company Type</p>
        </div>
        <p className="text-gray-900 text-xl font-black">
          {
            enterpriseTypes.find(
              (type) => type.value === formData.entrepriseType
            )?.label
          }
        </p>
      </div>
    </div>
  );
};

export default ReviewCompanyTypeImages;
