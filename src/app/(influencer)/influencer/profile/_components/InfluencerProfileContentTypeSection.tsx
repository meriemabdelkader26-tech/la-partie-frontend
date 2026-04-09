import { Influencer } from "@/app/types";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileContentTypeSection = (props: Props) => {
  const { data } = props;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Content Types</h2>
      <div className="flex flex-wrap gap-3">
        {data?.typeContenu.map((type) => (
          <span
            key={type}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileContentTypeSection;
