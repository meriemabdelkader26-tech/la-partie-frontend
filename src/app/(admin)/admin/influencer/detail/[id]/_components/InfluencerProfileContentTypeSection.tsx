import { Influencer } from "@/app/types";
import { Layers } from "lucide-react";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileContentTypeSection = (props: Props) => {
  const { data } = props;
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-50">
          <Layers className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Content Specialization</h2>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {data?.typeContenu.map((type) => (
          <span
            key={type}
            className="bg-gray-50 border border-gray-100 text-gray-700 px-5 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-amber-50 hover:border-amber-100 hover:text-amber-700 cursor-default"
          >
            {type.replace('_', ' ')}
          </span>
        ))}
        {(!data?.typeContenu || data.typeContenu.length === 0) && (
          <p className="text-gray-400 text-sm font-medium italic">No content types specified.</p>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfileContentTypeSection;
