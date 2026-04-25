import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const HomeHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Badge - Animated */}
        <div className="inline-flex items-center gap-2 bg-black/5 border border-black/10 rounded-full px-6 py-2.5 mb-8 animate-fadeInDown backdrop-blur-sm hover:bg-black/10 transition-all duration-300 hover:scale-105">
          <Sparkles className="text-black animate-pulse" size={16} />
          <span className="text-black text-sm font-medium tracking-wide">
            Welcome to {APP_NAME}
          </span>
        </div>

        {/* Main Heading - Animated with Stagger */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black mb-6 text-balance leading-tight animate-fadeInUp delay-100">
          Connect Influencers with{" "}
          <span className="relative inline-block">
            <span className="text-gradient">Brands</span>
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black to-transparent"></span>
          </span>
        </h1>

        {/* Subtitle - Animated */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto text-balance leading-relaxed animate-fadeInUp delay-300">
          The ultimate platform for influencers to showcase their talent and for
          brands to find the perfect partnerships. Grow your influence, monetize
          your content, and scale your business.
        </p>

        {/* CTA Buttons - Animated */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp delay-500">
          <Link href="/register?role=influencer">
            <Button
              size="lg"
              className="bg-black hover:bg-gray-800 text-white gap-2 px-8 py-6 text-lg rounded-xl shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              Start as Influencer 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/register?role=company">
            <Button
              size="lg"
              className="border-2 border-black text-black hover:bg-black hover:text-white bg-transparent px-8 py-6 text-lg rounded-xl shadow-soft hover:shadow-large transition-all duration-300 hover:scale-105"
            >
              Start as Brand
            </Button>
          </Link>
        </div>

        {/* Floating Stats/Trust Badges - Animated */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fadeIn delay-700">
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">10K+</div>
            <div className="text-sm text-gray-500 mt-1">Active Influencers</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">500+</div>
            <div className="text-sm text-gray-500 mt-1">Brand Partners</div>
          </div>
          <div className="text-center group cursor-default">
            <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">1M+</div>
            <div className="text-sm text-gray-500 mt-1">Campaigns Launched</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;