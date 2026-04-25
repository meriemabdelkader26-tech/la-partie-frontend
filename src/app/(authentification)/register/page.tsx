"use client";
import { useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import BackButton from "@/components/shared/BackButton";
import { cn } from "@/lib/utils";
import RegisterFormBody from "./_components/RegisterFormBody";
import { APP_NAME } from "@/constant";
import { Building2, Sparkles, CheckCircle, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {
  const [role] = useQueryState("role") ?? "influencer";
  const isCompany = role === "company";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
      </div>

      {/* Register Container */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-start relative z-10">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden md:block animate-fadeInLeft">
          <div className="p-12 sticky top-8">
            {/* Logo */}
            <Link href="/" className="inline-block mb-12 group">
              <h1 className="text-4xl font-black text-black group-hover:scale-105 transition-transform">
                {APP_NAME}
                <span className="inline-block w-2 h-2 bg-black rounded-full ml-2 group-hover:animate-pulse"></span>
              </h1>
            </Link>

            {/* Hero Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full mb-6">
                  {isCompany ? (
                    <Building2 className="w-4 h-4 text-black" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-black" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-black">
                    {isCompany ? "For Brands" : "For Influencers"}
                  </span>
                </div>
                <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
                  {isCompany ? "Grow Your Brand" : "Build Your Career"}
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {isCompany
                    ? "Connect with the right influencers to boost your brand visibility and drive authentic engagement."
                    : "Start collaborating with leading brands to grow your reach and unlock new partnership opportunities."}
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-black uppercase tracking-wider">
                  What you'll get:
                </h3>
                {isCompany ? (
                  <>
                    {[
                      "Access to 50K+ verified influencers",
                      "AI-powered influencer matching",
                      "Campaign management dashboard",
                      "Real-time analytics & ROI tracking"
                    ].map((benefit, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 animate-fadeInUp"
                        style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                      >
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      "Connect with 500+ leading brands",
                      "Browse exclusive campaigns",
                      "Get paid for your creativity",
                      "Track your earnings & growth"
                    ].map((benefit, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-start gap-3 animate-fadeInUp"
                        style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                      >
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-white fill-white" />
                        </div>
                        <span className="text-gray-700 leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Trust Badge */}
              <div className="pt-8 border-t border-black/10">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-black mb-1">5K+</div>
                    <div className="text-xs text-gray-500">Active Today</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-black fill-black" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">4.9/5 Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="animate-fadeInRight">
          <Card className="bg-white border-2 border-black/5 shadow-large hover:shadow-xl transition-shadow duration-300 rounded-3xl overflow-hidden">
            <div className="p-8 md:p-10">
              {/* Back Button */}
              <div className="mb-8">
                <BackButton />
              </div>

              {/* Form Header */}
              <div className="mb-8">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 animate-scaleIn shadow-medium",
                  isCompany ? "bg-black" : "bg-black"
                )}>
                  {isCompany ? (
                    <Building2 className="text-white" size={28} />
                  ) : (
                    <Sparkles className="text-white" size={28} />
                  )}
                </div>
                
                {/* Mobile Logo */}
                <div className="md:hidden mb-6">
                  <Link href="/" className="inline-block">
                    <h1 className="text-3xl font-black text-black">
                      {APP_NAME}
                    </h1>
                  </Link>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">
                  Join as {isCompany ? "Brand" : "Influencer"}
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  Create your account and start your journey today
                </p>
              </div>

              {/* Register Form */}
              <RegisterFormBody />

              {/* Sign In Link */}
              <div className="mt-8 text-center p-6 bg-black/5 rounded-2xl">
                <p className="text-gray-600 mb-3">
                  Already have an account?
                </p>
                <Link 
                  href="/login"
                  className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all group"
                >
                  <span>Sign in instead</span>
                  <TrendingUp size={16} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;