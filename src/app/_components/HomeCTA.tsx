import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const HomeCTA = () => {
  return (
    <section className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* CTA Card */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Content */}
          <div className="relative text-center card-modern bg-white p-16 animate-scaleIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black/5 rounded-full px-6 py-2 mb-8">
              <Sparkles className="text-black" size={16} />
              <span className="text-black text-sm font-semibold tracking-wide">
                JOIN TODAY
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              Ready to Get Started?
            </h2>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of influencers and brands already using {APP_NAME} to create amazing partnerships
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/register?role=influencer">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white gap-2 px-10 py-7 text-lg rounded-xl shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-black text-black hover:bg-black hover:text-white bg-transparent px-10 py-7 text-lg rounded-xl shadow-soft hover:shadow-large transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;