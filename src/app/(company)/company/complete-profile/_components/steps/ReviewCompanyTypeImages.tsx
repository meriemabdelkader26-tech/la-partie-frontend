import IconHeader from "@/components/shared/IconHeader";
import { ProfileCompanyFormData } from "../types";
import { Building2 } from "lucide-react";
import { enterpriseTypes } from "../constants";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyTypeImages = (props: Props) => {
  const { formData } = props;
  return (
    <div className="space-y-6">
      {formData.imagesLogos.length > 0 && (
        <div className="cardCompanyColor">
          <p className="text-slate-400 text-sm mb-4">Company Logo</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {formData.imagesLogos.map((img, index) => (
              <div
                className="bg-slate-900 rounded-lg p-6 flex items-center justify-center h-40"
                key={index}
              >
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Company Image ${index + 1}`}
                  className="max-h-32 max-w-32 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="cardCompanyColor">
        <IconHeader title="Company Type" icon={Building2} />
        <p className="text-white text-lg font-semibold">
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
