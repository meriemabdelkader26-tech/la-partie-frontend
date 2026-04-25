import { Influencer } from "@/app/types";
import { Tag } from "lucide-react";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileNicheSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
          <Tag className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Categories & Expertise</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {data?.selectedCategories.map((category) => (
          <div
            key={category.id}
            className="group bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-100 p-4 rounded-2xl transition-all duration-300 flex-1 min-w-[200px]"
          >
            <h3 className="text-sm font-black text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-wider mb-1">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-gray-500 text-xs font-medium line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
        ))}
        {(!data?.selectedCategories || data.selectedCategories.length === 0) && (
          <p className="text-gray-400 text-sm font-medium italic">No categories selected.</p>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfileNicheSection;
