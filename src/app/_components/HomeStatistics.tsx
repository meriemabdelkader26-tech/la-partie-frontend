"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: string;
  duration?: number;
}

const Counter = ({ value, duration = 2 }: CounterProps) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const num = Math.round(latest);
    if (value.includes("K+")) {
      return `${num}K+`;
    } else if (value.includes("M+")) {
      return `$${num}M+`;
    } else if (value.includes("%")) {
      return `${num}%`;
    }
    return num.toString();
  });

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
      if (value.includes("K+")) {
        targetValue = parseInt(value.replace("K+", ""));
      } else if (value.includes("M+")) {
        targetValue = parseInt(value.replace("$", "").replace("M+", ""));
      } else if (value.includes("%")) {
        targetValue = parseInt(value.replace("%", ""));
      }

      const controls = animate(count, targetValue, { duration });
      return controls.stop;
    }
  }, [isInView, value, duration, count]);

  return (
    <motion.div
      ref={ref}
      className="text-4xl md:text-5xl font-bold text-pink-400 mb-2"
    >
      {rounded}
    </motion.div>
  );
};

const HomeStatistics = () => {
  return (
    <section className="py-20 px-4 border-t border-rose-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          By The Numbers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Active Influencers" },
            { number: "10K+", label: "Brands Partnered" },
            { number: "$100M+", label: "Collaborations Value" },
            { number: "95%", label: "Success Rate" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <Counter value={stat.number} duration={2.5} />
              <p className="text-rose-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStatistics;
