import IconHeader from "@/components/shared/IconHeader";
import { Building2 } from "lucide-react";
import { ProfileCompanyFormData } from "../types";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyBasicInfo = (props: Props) => {
  const { formData } = props;
  return (
    <div className="cardCompanyColor">
      <IconHeader title="Basic Information" icon={Building2} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Company Name
          </p>
          <p className="text-white text-sm font-medium">
            {formData.companyName}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Matricule
          </p>
          <p className="text-white text-sm font-medium">{formData.matricule}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Website
          </p>
          <p className="text-green-400 text-sm font-medium truncate">
            {formData.website || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Contact Email
          </p>
          <p className="text-white text-sm font-medium">
            {formData.contactEmail}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCompanyBasicInfo;
