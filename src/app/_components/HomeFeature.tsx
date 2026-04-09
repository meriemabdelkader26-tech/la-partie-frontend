import { APP_NAME } from "@/constant";
import { Award, BarChart3, Zap } from "lucide-react";

const HomeFeature = () => {
  return (
    <section className="py-20 px-4 border-t border-slate-700">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Why Choose {APP_NAME}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-green-500/30 transition-colors">
            <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Fast & Easy</h3>
            <p className="text-slate-400">
              Get started in minutes with our intuitive platform
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-green-500/30 transition-colors">
            <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Verified Profiles
            </h3>
            <p className="text-slate-400">
              All influencers are verified for authenticity
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-green-500/30 transition-colors">
            <div className="w-16 h-16 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="text-green-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Real Analytics
            </h3>
            <p className="text-slate-400">
              Track performance with detailed insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeature;