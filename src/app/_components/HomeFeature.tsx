import { APP_NAME } from "@/constant";
import { Award, BarChart3, Zap } from "lucide-react";

const HomeFeature = () => {
  return (
    <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Why Choose {APP_NAME}?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the most advanced influencer marketing platform
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group card-modern bg-white p-10 text-center hover:scale-105 transition-all duration-300 animate-fadeInUp delay-100">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-white" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">Fast & Easy</h3>
            <p className="text-gray-600 leading-relaxed">
              Get started in minutes with our intuitive platform designed for speed and simplicity
            </p>
          </div>

          <div className="group card-modern bg-white p-10 text-center hover:scale-105 transition-all duration-300 animate-fadeInUp delay-200">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <Award className="text-white" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Verified Profiles
            </h3>
            <p className="text-gray-600 leading-relaxed">
              All influencers are thoroughly verified to ensure authenticity and quality
            </p>
          </div>

          <div className="group card-modern bg-white p-10 text-center hover:scale-105 transition-all duration-300 animate-fadeInUp delay-300">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300">
              <BarChart3 className="text-white" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4">
              Real Analytics
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track campaign performance with detailed insights and real-time data
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFeature;