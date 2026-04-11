import { Button } from "@/components/ui/button";
import { BRAND_SERVICES, INFLUENCER_SERVICES } from "@/constant";
import { CheckCircle2, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const HomeService = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-pastel-dark-blue mb-16">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-pastel-green/20 to-pastel-green/10 rounded-lg p-8 border border-pastel-green/30 hover:border-pastel-green/60 transition-colors">
            <div className="w-12 h-12 bg-pastel-green rounded-lg flex items-center justify-center mb-4">
              <Users className="text-pastel-dark-blue" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-pastel-dark-blue mb-4">
              For Influencers
            </h3>
            <ul className="space-y-3 mb-6">
              {INFLUENCER_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-pastel-green shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-pastel-blue">{service}</span>
                </li>
              ))}
            </ul>

            <Link href="/register?role=influencer">
              <Button className="w-full bg-pastel-green hover:bg-pastel-red text-pastel-dark-blue">
                Join as Influencer
              </Button>
            </Link>
          </div>

          <div className="bg-linear-to-br from-pastel-blue to-pastel-dark-blue/50 rounded-lg p-8 border border-pastel-blue hover:border-pastel-dark-blue transition-colors">
            <div className="w-12 h-12 bg-pastel-blue rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="text-pastel-green" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-pastel-dark-blue mb-4">For Brands</h3>
            <ul className="space-y-3 mb-6">
              {BRAND_SERVICES.map((service, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2
                    className="text-pastel-green shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-pastel-blue">{service}</span>
                </li>
              ))}
            </ul>
            <Link href="/register?role=company">
              <Button className="w-full bg-pastel-blue hover:bg-pastel-dark-blue text-pastel-dark-blue">
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