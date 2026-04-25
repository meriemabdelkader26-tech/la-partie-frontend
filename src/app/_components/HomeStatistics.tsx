"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: string;
  duration?: number;
}

const Counter = ({ value, duration = 2 }: CounterProps) => {
  const [isInView, setIsInView] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isInView]);

  useEffect(() => {
    if (isInView) {
      let targetValue = 0;
      let suffix = "";
      
      if (value.includes("K+")) {
        targetValue = parseInt(value.replace("K+", ""));
        suffix = "K+";
      } else if (value.includes("M+")) {
        targetValue = parseInt(value.replace("$", "").replace("M+", ""));
        suffix = "M+";
      } else if (value.includes("%")) {
        targetValue = parseInt(value.replace("%", ""));
        suffix = "%";
      }

      const controls = animate(count, targetValue, { 
        duration,
        onUpdate: (latest) => {
          const num = Math.round(latest);
          if (value.includes("M+")) {
            setDisplayValue(`$${num}${suffix}`);
          } else {
            setDisplayValue(`${num}${suffix}`);
          }
        }
      });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  return (
    <div
      ref={ref}
      className="text-5xl md:text-6xl font-black mb-4"
      style={{ color: '#ffffff' }}
    >
      {displayValue}
    </div>
  );
};

const HomeStatistics = () => {
  return (
    <section className="py-32 px-4 bg-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fadeInUp">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            By The Numbers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real impact, measurable results, exceptional growth
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { number: "50K+", label: "Active Influencers" },
            { number: "10K+", label: "Brands Partnered" },
            { number: "$100M+", label: "Collaborations Value" },
            { number: "95%", label: "Success Rate" },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="text-center group cursor-default animate-fadeInUp"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative">
                <Counter value={stat.number} duration={2.5} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-white group-hover:w-24 transition-all duration-300"></div>
              </div>
              <p className="text-gray-300 text-lg mt-6 group-hover:text-white transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStatistics;