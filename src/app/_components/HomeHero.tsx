import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const HomeHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 rounded-full px-4 py-2 mb-8">
          <Sparkles className="text-pink-400" size={16} />
          <span className="text-pink-400 text-sm font-medium">
            Welcome to {APP_NAME}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
          Connect Influencers with{" "}
          <span className="text-pink-400">Brands</span>
        </h1>
        <p className="text-xl text-rose-600 mb-8 max-w-3xl mx-auto text-balance">
          The ultimate platform for influencers to showcase their talent and for
          brands to find the perfect partnerships. Grow your influence, monetize
          your content, and scale your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button
              size="lg"
              className="border-pink-600 text-pink-400 hover:bg-pink-600/10 bg-transparent border gap-2"
            >
              Sign In <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white gap-2"
            >
              Sign Up <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
