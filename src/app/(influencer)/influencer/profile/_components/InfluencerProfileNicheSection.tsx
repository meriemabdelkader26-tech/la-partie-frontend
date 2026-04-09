import { Influencer } from "@/app/types";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileNicheSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Niches & Expertise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.selectedCategories.map((category) => (
          <div
            key={category.id}
            className="bg-slate-800 border-slate-700 p-4 rounded-xl"
          >
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              {category.name}
            </h3>
            <p className="text-slate-400 text-sm">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileNicheSection;
