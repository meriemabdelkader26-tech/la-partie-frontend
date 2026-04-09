import IconHeader from "@/components/shared/IconHeader";
import { MapPin } from "lucide-react";
import { ProfileCompanyFormData } from "../types";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyAddress = (props: Props) => {
  const { formData } = props;
  return (
    <div className="cardCompanyColor">
      <IconHeader title="Address" icon={MapPin} />

      <p className="text-slate-300 text-sm leading-relaxed">
        {formData.address}
        <br />
        {formData.city}, {formData.state} {formData.postalCode}
        <br />
        {formData.country}
      </p>
    </div>
  );
};

export default ReviewCompanyAddress;
