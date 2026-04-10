import { Influencer } from "@/app/types";
import { Button } from "@/components/ui/button";

interface Props {
  data: Influencer | null;
}
const InfluencerProfileSocialNetworkSection = (props: Props) => {
  const { data } = props;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Social Networks</h2>
      <div className="space-y-4">
        {data?.reseauxSociaux.map((network, idx) => (
          <div key={idx} className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">
                {network.plateforme}
              </h3>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => window.open(network.urlProfil, "_blank")}
              >
                Visit Profile
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Followers</p>
                <p className="text-xl font-bold text-white">
                  {network.nombreAbonnes.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Engagement</p>
                <p className="text-xl font-bold text-green-400">
                  {network.tauxEngagement}%
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg. Likes</p>
                <p className="text-xl font-bold text-white">
                  {network.moyenneLikes}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Avg. Comments</p>
                <p className="text-xl font-bold text-white">
                  {network.moyenneCommentaires}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Frequency</p>
                <p className="text-xl font-bold text-white">
                  {network.frequencePublication}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfluencerProfileSocialNetworkSection;