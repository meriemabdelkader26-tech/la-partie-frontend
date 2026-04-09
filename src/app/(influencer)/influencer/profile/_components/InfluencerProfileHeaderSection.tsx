import InfluencerProfileStat from "./InfluencerProfileStat";
import InfluencerProfileLanguageChip from "./InfluencerProfileLanguageChip";
import { Influencer } from "@/app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  data: Influencer | null;
}

const InfluencerProfileHeaderSection = (props: Props) => {
  const { data } = props;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Avatar className="size-36">
          <AvatarImage
            src={data?.images.find((e) => e.isDefault && e.isPublic)?.url}
            alt="influencer-profile"
          />
          <AvatarFallback>
            {data?.pseudo.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-white">{data?.pseudo}</h1>
            <span className="bg-green-400 text-slate-900 px-4 py-1 rounded-full text-sm font-semibold">
              {data?.disponibiliteCollaboration}
            </span>
          </div>
          <p className="text-slate-400 mb-2">@{data?.instagramUsername}</p>
          <p className="text-slate-300 mb-4 whitespace-pre-line">
            {data?.biography}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <InfluencerProfileStat
              label="Followers"
              value={`${data?.reseauxSociaux[0]?.nombreAbonnes}`}
            />
            <InfluencerProfileStat
              label="Engagement Rate"
              value={`${data?.reseauxSociaux[0]?.tauxEngagement}%`}
            />
            <InfluencerProfileStat
              label="Avg. Likes"
              value={`${data?.reseauxSociaux[0]?.moyenneLikes}`}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {data?.langues.map((lang) => (
              <InfluencerProfileLanguageChip key={lang} label={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileHeaderSection;
