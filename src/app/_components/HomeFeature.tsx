import { APP_NAME } from "@/constant";
import { Award, BarChart3, Zap } from "lucide-react";

const HomeFeature = () => {
  return (
    <section className="py-20 px-4 border-t border-pastel-blue">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pastel-dark-blue mb-16">
          Why Choose {APP_NAME}?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-pastel-blue/50 border border-pastel-blue rounded-lg p-8 hover:border-pastel-green/30 transition-colors">
            <div className="w-16 h-16 bg-pastel-green/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-pastel-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-pastel-dark-blue mb-2">Fast & Easy</h3>
            <p className="text-pastel-blue">
              Get started in minutes with our intuitive platform
            </p>
          </div>
          <div className="bg-pastel-blue/50 border border-pastel-blue rounded-lg p-8 hover:border-pastel-green/30 transition-colors">
            <div className="w-16 h-16 bg-pastel-green/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="text-pastel-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-pastel-dark-blue mb-2">
              Verified Profiles
            </h3>
            <p className="text-pastel-blue">
              All influencers are verified for authenticity
            </p>
          </div>
          <div className="bg-pastel-blue/50 border border-pastel-blue rounded-lg p-8 hover:border-pastel-green/30 transition-colors">
            <div className="w-16 h-16 bg-pastel-green/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="text-pastel-green" size={32} />
            </div>
            <h3 className="text-xl font-bold text-pastel-dark-blue mb-2">
              Real Analytics
            </h3>
            <p className="text-pastel-blue">
              Track performance with detailed insights
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeature;