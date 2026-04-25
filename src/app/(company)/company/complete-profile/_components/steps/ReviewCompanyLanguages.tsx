import { ProfileCompanyFormData } from "../types";
import { Languages } from "lucide-react";

interface Props {
  formData: ProfileCompanyFormData;
}

const ReviewCompanyLanguages = (props: Props) => {
  const { formData } = props;
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 shadow-sm animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-emerald-500" />
        <p className="text-gray-900 font-black uppercase tracking-widest text-xs">Communication Languages</p>
      </div>
      <div className="flex flex-wrap gap-3 ml-5.5">
        {formData.langues.map((lang: string) => (
          <span
            key={lang}
            className="inline-flex items-center px-4 py-1.5 rounded-xl bg-white border border-black/5 text-gray-700 text-xs font-bold shadow-soft hover:shadow-medium transition-all"
          >
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ReviewCompanyLanguages;
