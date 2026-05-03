"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import InfluencerProfileStat from "./InfluencerProfileStat";
import InfluencerProfileLanguageChip from "./InfluencerProfileLanguageChip";

interface InfluencerProfileHeaderSectionProps {
  data: any;
}

const InfluencerProfileHeaderSection = ({ data }: InfluencerProfileHeaderSectionProps) => {
  return (
    <div className="p-10 border-b-2 border-black/5 bg-white">
      <div className="flex flex-col md:flex-row gap-10 items-start animate-fadeIn">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-white shadow-large animate-scaleIn shrink-0">
          <AvatarImage
            src={data?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback className="bg-black text-white text-4xl font-bold">
            {data?.pseudo ? data.pseudo.substring(0, 2).toUpperCase() : data?.user?.name?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 animate-slideInRight delay-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <h1 className="text-4xl font-black text-black tracking-tight">{data?.pseudo || data?.user?.name}</h1>
            <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 shadow-sm self-start sm:self-center">
              {data?.disponibiliteCollaboration?.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-gray-500 font-bold text-lg mb-4 tracking-tight">@{data?.instagramUsername}</p>
          <p className="text-gray-600 mb-8 whitespace-pre-line font-medium leading-relaxed max-w-2xl text-base">
            {data?.biography}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <InfluencerProfileStat
              label="Followers"
              value={`${data?.statistiquesGlobales?.followersTotaux || data?.reseauxSociaux?.[0]?.nombreAbonnes || '0'}`}
              className="animate-fadeInUp"
              style={{ animationDelay: '400ms' }}
            />
            <InfluencerProfileStat
              label="Engagement Rate"
              value={`${data?.statistiquesGlobales?.engagementMoyenGlobal?.toFixed(2) || data?.reseauxSociaux?.[0]?.tauxEngagement || '0'}%`}
              className="animate-fadeInUp"
              style={{ animationDelay: '500ms' }}
            />
            <InfluencerProfileStat
              label="Avg. Likes"
              value={`${data?.reseauxSociaux?.[0]?.moyenneLikes || '0'}`}
              className="animate-fadeInUp"
              style={{ animationDelay: '600ms' }}
            />
          </div>

          <div className="flex flex-wrap gap-3 animate-fadeInUp delay-700">
            {data?.langues?.map((lang: string, idx: number) => (
              <InfluencerProfileLanguageChip key={lang} label={lang} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileHeaderSection;
