import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const HomeHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-8">
          <Sparkles className="text-green-400" size={16} />
          <span className="text-green-400 text-sm font-medium">
            Welcome to {APP_NAME}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
          Connect Influencers with{" "}
          <span className="text-green-400">Brands</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto text-balance">
          The ultimate platform for influencers to showcase their talent and for
          brands to find the perfect partnerships. Grow your influence, monetize
          your content, and scale your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=influencer">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              Start as Influencer <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/register?role=company">
            <Button
              size="lg"
              className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 bg-transparent border"
            >
              Start as Brand
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;