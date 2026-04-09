import IconHeader from "@/components/shared/IconHeader";
import { Users } from "lucide-react";
import { ProfileCompanyFormData } from "../types";
import { companySizes, domainActivities } from "../constants";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyDetail = (props: Props) => {
  const { formData } = props;
  return (
    <div className="cardCompanyColor">
      <IconHeader title="Company Details" icon={Users} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Company Size
          </p>
          <p className="text-white text-sm font-medium">
            {companySizes.find((size) => size.value === formData.size)?.label ||
              formData.size}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Domain
          </p>
          <p className="text-white text-sm font-medium">
            {domainActivities.find(
              (domain) => domain.value === formData.domainActivity
            )?.label || formData.domainActivity}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Collaboration Availability
          </p>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
            {formData.disponibiliteCollaboration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompanyDetail;
