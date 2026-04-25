import { Influencer } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink } from "lucide-react";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileSocialNetworkSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="bg-white border-2 border-black/5 rounded-[40px] p-10 mb-12 shadow-soft animate-fadeInUp delay-400">
      <div className="flex items-center gap-3 mb-10 animate-fadeInDown">
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
          <Globe className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black text-black tracking-tight">Social Networks</h2>
      </div>

      <div className="space-y-6">
        {data?.reseauxSociaux.map((network, idx) => (
          <div 
            key={idx} 
            className="bg-gray-50 border border-black/5 rounded-[32px] p-8 hover:bg-white hover:border-black/10 hover:shadow-medium transition-all duration-500 group animate-fadeInUp"
            style={{ animationDelay: `${500 + idx * 150}ms` }}
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center group-hover:bg-black transition-colors duration-300 shadow-sm">
                  <span className="font-black text-black group-hover:text-white transition-colors capitalize">{network.plateforme[0]}</span>
                </div>
                <h3 className="text-2xl font-black text-black capitalize tracking-tight">
                  {network.plateforme}
                </h3>
              </div>
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white font-bold rounded-2xl px-8 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.05] group/btn"
                onClick={() => window.open(network.urlProfil, "_blank")}
              >
                Visit Profile
                <ExternalLink className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {[
                { label: "Followers", value: Number(network.nombreAbonnes).toLocaleString(), color: "text-black" },
                { label: "Engagement", value: `${network.tauxEngagement}%`, color: "text-green-600" },
                { label: "Avg. Likes", value: Number(network.moyenneLikes).toLocaleString(), color: "text-black" },
                { label: "Avg. Comments", value: Number(network.moyenneCommentaires).toLocaleString(), color: "text-black" },
                { label: "Frequency", value: network.frequencePublication?.replace(/_/g, " "), color: "text-black", capitalize: true }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="animate-fadeInUp" style={{ animationDelay: `${700 + sIdx * 50}ms` }}>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.color} ${stat.capitalize ? 'capitalize' : ''}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileSocialNetworkSection;
