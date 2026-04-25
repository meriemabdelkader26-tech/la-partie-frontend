"use client";
import { TOP_COMPANIES } from "@/constant";
import Image from "next/image";
import { useState } from "react";

const HomeTopCompanies = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-4 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <div className="inline-block mb-4">
            <span className="text-sm font-bold tracking-widest uppercase text-gray-400">
              OUR PARTNERS
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Trusted by Leading Brands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join the world's most innovative companies already using our platform to connect with top influencers
          </p>
        </div>

        {/* Premium Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {TOP_COMPANIES.map((company, idx) => (
            <div
              key={idx}
              className="group relative animate-fadeIn"
              style={{ animationDelay: `${idx * 100}ms` }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div className="relative bg-white rounded-2xl p-8 h-48 flex flex-col items-center justify-center transition-all duration-500 border-2 border-black/5 hover:border-black/10 hover:shadow-large cursor-pointer group-hover:scale-105">
                {/* Logo Container */}
                <div className="relative w-full h-24 mb-4 transition-all duration-500 group-hover:scale-110">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain opacity-40 group-hover:opacity-100 transition-opacity duration-500 filter grayscale group-hover:grayscale-0"
                    style={{ objectFit: 'contain' }}
                  />
                </div>

                {/* Company Name */}
                <div className="text-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-black font-bold text-lg mb-1">
                    {company.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {company.description}
                  </p>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{
                       background: 'linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.03) 100%)'
                     }}>
                </div>
              </div>

              {/* Animated Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10 blur-xl ${hoveredIndex === idx ? 'opacity-20' : 'opacity-0'}`}
                   style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.2) 0%, transparent 70%)' }}>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 animate-fadeInUp delay-500">
          <div className="text-center p-8 bg-gradient-to-br from-black to-gray-900 rounded-2xl text-white group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform">500+</div>
            <p className="text-gray-300 text-sm">Global Brands</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-black to-gray-900 rounded-2xl text-white group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform">$2B+</div>
            <p className="text-gray-300 text-sm">Campaign Value</p>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-black to-gray-900 rounded-2xl text-white group hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-black mb-2 group-hover:scale-110 transition-transform">98%</div>
            <p className="text-gray-300 text-sm">Satisfaction Rate</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fadeInUp delay-700">
          <p className="text-gray-400 text-sm mb-6">
            Join these industry leaders and elevate your brand
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors cursor-pointer">
            <span className="text-sm font-semibold text-black">View all partners</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeTopCompanies;