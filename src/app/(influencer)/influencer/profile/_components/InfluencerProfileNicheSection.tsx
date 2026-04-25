import { Influencer } from "@/app/types";
import { Target } from "lucide-react";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileNicheSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="mb-12 animate-fadeIn">
      <div className="flex items-center gap-3 mb-8 animate-fadeInDown">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black text-black tracking-tight">Niches & Expertise</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.selectedCategories?.map((category, idx) => (
          <div
            key={category.id}
            className="bg-white border-2 border-black/5 p-8 rounded-3xl shadow-soft hover:shadow-medium hover:border-black/20 transition-all duration-500 group animate-fadeInUp"
            style={{ animationDelay: `${200 + idx * 100}ms` }}
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
              <span className="font-black text-xs">{idx + 1}</span>
            </div>
            <h3 className="text-xl font-bold text-black mb-2 group-hover:text-gray-800 transition-colors">
              {category.name}
            </h3>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileNicheSection;
