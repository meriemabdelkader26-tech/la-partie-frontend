import IconHeader from "@/components/shared/IconHeader";
import { ProfileCompanyFormData } from "../types";
import { Languages } from "lucide-react";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyLanguages = (props: Props) => {
  const { formData } = props;
  return (
    <div className="cardCompanyColor">
      <IconHeader title="Languages" icon={Languages} />
      <div className="flex flex-wrap gap-2">
        {formData.langues.map((lang: string) => (
          <span
            key={lang}
            className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCompanyLanguages;
