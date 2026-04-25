import { Influencer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Share2, ExternalLink, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

interface Props {
  data: Influencer | null;
}

const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-600" />;
  if (p.includes('twitter')) return <Twitter className="w-5 h-5 text-blue-400" />;
  if (p.includes('youtube')) return <Youtube className="w-5 h-5 text-red-600" />;
  if (p.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-700" />;
  return <Share2 className="w-5 h-5 text-emerald-600" />;
};

const InfluencerProfileSocialNetworkSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
          <Share2 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Social Accounts</h2>
      </div>

      <div className="space-y-6">
        {data?.reseauxSociaux.map((network, idx) => (
          <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 group hover:border-emerald-100 hover:bg-white transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                  {getPlatformIcon(network.plateforme)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider leading-none mb-1">
                    {network.plateforme}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Verified Channel</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 h-9 rounded-xl text-xs font-bold gap-2 shadow-sm"
                onClick={() => network.urlProfil && window.open(network.urlProfil, "_blank")}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Visit Profile
              </Button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Followers</span>
                <span className="text-xl font-black text-gray-900">{network.nombreAbonnes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Engagement</span>
                <span className="text-xl font-black text-emerald-600">{network.tauxEngagement}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Likes</span>
                <span className="text-xl font-black text-gray-900">{network.moyenneLikes.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Comments</span>
                <span className="text-xl font-black text-gray-900">{network.moyenneCommentaires.toLocaleString()}</span>
              </div>
              <div className="flex flex-col lg:col-span-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Post Frequency</span>
                <span className="text-sm font-bold text-gray-700">{network.frequencePublication || "Not specified"}</span>
              </div>
            </div>
          </div>
        ))}
        {(!data?.reseauxSociaux || data.reseauxSociaux.length === 0) && (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium text-sm italic">No social networks connected.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfluencerProfileSocialNetworkSection;
