import { Button } from "@/components/ui/button";
import { BRAND_SERVICES, INFLUENCER_SERVICES } from "@/constant";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const HomeService = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-pink-900/20 to-pink-800/10 rounded-lg p-8 border border-pink-500/30 hover:border-pink-500/60 transition-colors">
            <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              For Influencers
            </h3>
            <ul className="space-y-3 mb-6">
              {INFLUENCER_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-pink-400 shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-rose-600">{service}</span>
                </li>
              ))}
            </ul>

            <Link href="/register?role=influencer">
              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                Join as Influencer
              </Button>
            </Link>
          </div>

          <div className="bg-linear-to-br from-rose-100 to-rose-200/50 rounded-lg p-8 border border-rose-300 hover:border-rose-400 transition-colors">
            <div className="w-12 h-12 bg-rose-300 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-pink-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">For Brands</h3>
            <ul className="space-y-3 mb-6">
              {BRAND_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-pink-400 shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-rose-600">{service}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?role=company">
              <Button className="w-full bg-rose-300 hover:bg-rose-400 text-white">
                Join as Brand
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeService;
