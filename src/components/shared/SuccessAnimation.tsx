"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

interface SuccessAnimationProps {
  message?: string;
  onComplete?: () => void;
}

const SuccessAnimation = ({ 
  message = "Success!", 
  onComplete 
}: SuccessAnimationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const showTimer = setTimeout(() => setShow(true), 50);
    
    // Auto-complete after animation
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Success Card */}
      <div
        className={`relative bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full mx-4 transform transition-all duration-700 ${
          show ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {/* Sparkle Icons */}
        <div className="absolute -top-4 -left-4 animate-float">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute -top-4 -right-4 animate-float delay-300">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 animate-float delay-500">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Checkmark Circle with Animation */}
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Checkmark */}
          <div className="relative">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-black/10 animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-black/5 animate-pulse delay-200"></div>
            </div>

            {/* Main Checkmark Circle */}
            <div
              className={`relative w-32 h-32 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-700 ${
                show ? "rotate-0 scale-100" : "rotate-180 scale-0"
              }`}
            >
              {/* Inner Glow */}
              <div className="absolute inset-2 bg-white/10 rounded-full animate-pulse"></div>

              {/* Checkmark Icon with Draw Animation */}
              <div className={`transform transition-all duration-500 delay-300 ${
                show ? "scale-100 opacity-100" : "scale-0 opacity-0"
              }`}>
                <CheckCircle2 className="w-16 h-16 text-white animate-scaleIn" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2
              className={`text-3xl font-bold text-black transform transition-all duration-500 delay-500 ${
                show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {message}
            </h2>
            <p
              className={`text-gray-600 font-medium transform transition-all duration-500 delay-700 ${
                show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              Redirecting you now...
            </p>
          </div>

          {/* Loading Bar */}
          <div
            className={`w-full h-1.5 bg-gray-200 rounded-full overflow-hidden transform transition-all duration-500 delay-900 ${
              show ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          >
            <div className="h-full bg-gradient-to-r from-black via-gray-700 to-black animate-shimmer bg-[length:200%_100%]"></div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-black/10 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-black/10 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-black/10 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-black/10 rounded-br-lg"></div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
