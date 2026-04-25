import { Button } from "@/components/ui/button";
import { BRAND_SERVICES, INFLUENCER_SERVICES } from "@/constant";
import { CheckCircle2, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const HomeService = () => {
  return (
    <section className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your path and start building meaningful partnerships today
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Influencer Card */}
          <div className="group card-modern hover:shadow-large bg-white border-2 border-black/5 hover:border-black/20 p-10 animate-fadeInUp delay-100">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-black mb-6">
              For Influencers
            </h3>
            <ul className="space-y-4 mb-8">
              {INFLUENCER_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3 group/item">
                  <CheckCircle2
                    className="text-black shrink-0 mt-1 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                  <span className="text-gray-700 leading-relaxed">{service}</span>
                </li>
              ))}
            </ul>

            <Link href="/register?role=influencer">
              <Button className="w-full bg-black hover:bg-gray-800 text-white gap-2 py-6 text-lg rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 group/btn">
                Join as Influencer
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Brand Card */}
          <div className="group hover:shadow-large p-10 animate-fadeInUp delay-200 rounded-2xl border-2 border-black/5 hover:border-black/20 transition-all duration-300" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#ffffff' }}>
              <TrendingUp style={{ color: '#000000' }} size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6" style={{ color: '#ffffff' }}>For Brands</h3>
            <ul className="space-y-4 mb-8">
              {BRAND_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3 group/item">
                  <CheckCircle2
                    style={{ color: '#ffffff' }}
                    className="shrink-0 mt-1 group-hover/item:scale-110 transition-transform"
                    size={20}
                  />
                  <span className="leading-relaxed" style={{ color: '#e5e5e5' }}>{service}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?role=company">
              <Button className="w-full gap-2 py-6 text-lg rounded-xl shadow-medium hover:shadow-large transition-all duration-300 hover:scale-105 group/btn" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
                Join as Brand
                <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeService;