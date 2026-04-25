"use client";
import { Card } from "@/components/ui/card";
import LoginFormBody from "./_components/LoginFormBody";
import BackButton from "@/components/shared/BackButton";
import TextLinkButton from "@/components/shared/TextLinkButton";
import { Separator } from "@/components/ui/separator";
import { APP_NAME } from "@/constant";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
      </div>

      {/* Login Container */}
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden md:block animate-fadeInLeft">
          <div className="p-12">
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
                <h2 className="text-5xl font-bold text-black mb-6 leading-tight">
                  Welcome Back
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Continue your journey of connecting with amazing brands and influencers
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  "Access your dashboard instantly",
                  "Manage campaigns and collaborations",
                  "Track your performance analytics"
                ].map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 animate-fadeInUp"
                    style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                  >
                    <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-black/10">
                <div className="group cursor-default">
                  <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">10K+</div>
                  <div className="text-sm text-gray-500 mt-1">Users</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">500+</div>
                  <div className="text-sm text-gray-500 mt-1">Brands</div>
                </div>
                <div className="group cursor-default">
                  <div className="text-3xl font-bold text-black group-hover:scale-110 transition-transform">98%</div>
                  <div className="text-sm text-gray-500 mt-1">Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-fadeInRight">
          <Card className="bg-white border-2 border-black/5 shadow-large hover:shadow-xl transition-shadow duration-300 rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12">
              {/* Back Button */}
              <div className="mb-8">
                <BackButton />
              </div>

              {/* Form Header */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 animate-scaleIn">
                  <Lock className="text-white" size={28} />
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
                  Sign In
                </h1>
                <p className="text-gray-600">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Login Form */}
              <LoginFormBody />

              {/* Forgot Password */}
              <div className="mt-6 text-center">
                <Link 
                  href="/reset-password"
                  className="text-sm text-gray-600 hover:text-black transition-colors inline-flex items-center gap-2 group"
                >
                  <span>Forgot your password?</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center p-6 bg-black/5 rounded-2xl">
                <p className="text-gray-600 mb-3">
                  Don't have an account?
                </p>
                <Link 
                  href="/register?role=influencer"
                  className="inline-flex items-center gap-2 text-black font-semibold hover:gap-3 transition-all group"
                >
                  <span>Create an account</span>
                  <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
