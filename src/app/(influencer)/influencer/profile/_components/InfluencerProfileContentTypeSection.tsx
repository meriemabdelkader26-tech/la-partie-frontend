import { Influencer } from "@/app/types";
import { Play } from "lucide-react";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileContentTypeSection = (props: Props) => {
  const { data } = props;
  return (
    <div className="bg-white border-2 border-black/5 rounded-[32px] p-8 shadow-soft animate-fadeInUp delay-500">
      <div className="flex items-center gap-3 mb-8 animate-fadeInDown">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
          <Play className="w-4 h-4 text-white fill-current" />
        </div>
        <h2 className="text-xl font-black text-black tracking-tight uppercase tracking-widest text-sm">Content Formats</h2>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {data?.typeContenu?.map((type, idx) => (
          <span
            key={type}
            className="bg-gray-50 text-black border-2 border-black/5 px-6 py-3 rounded-2xl font-black text-sm shadow-inner-soft hover:bg-black hover:text-white hover:border-black transition-all duration-300 cursor-default animate-scaleIn"
            style={{ animationDelay: `${600 + idx * 100}ms` }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileContentTypeSection;
