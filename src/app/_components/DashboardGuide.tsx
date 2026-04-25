"use client";

import { useState, useEffect } from "react";
import { createPortal as createReactPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Search,
  LayoutDashboard,
  Wallet,
  BarChart3,
  MessageSquare,
  UserCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
  icon: any;
  color: string;
  image?: string;
  targetId?: string;
}

const influencerSteps: Step[] = [
  {
    title: "Welcome to InfluBridge",
    description: "Your all-in-one platform to connect with top brands and turn your influence into earnings. Let's show you around!",
    icon: Sparkles,
    color: "yellow",
  },
  {
    title: "Complete Your Profile",
    description: "A complete profile is your best business card. Add your social media accounts and showcase your best content to stand out to brands.",
    icon: UserCircle,
    color: "blue",
    targetId: "sidebar-item-my-profile",
  },
  {
    title: "Explore Opportunities",
    description: "Find campaigns that match your niche. Apply with a professional proposal and your desired price for the collaboration.",
    icon: Search,
    color: "purple",
    targetId: "sidebar-item-offers",
  },
  {
    title: "Manage Campaigns",
    description: "Track all your active collaborations in one place. Stay updated on your application status and deliverable deadlines.",
    icon: LayoutDashboard,
    color: "emerald",
    targetId: "sidebar-item-campaigns",
  },
  {
    title: "Track Your Earnings",
    description: "Monitor your income and request payouts easily. Our secure escrow system ensures you get paid for your hard work.",
    icon: Wallet,
    color: "orange",
    targetId: "sidebar-item-earnings",
  },
  {
    title: "Performance Analytics",
    description: "Deep dive into your engagement metrics. Understand what works best for your audience and grow your reach.",
    icon: BarChart3,
    color: "pink",
    targetId: "sidebar-item-dashboard",
  },
  {
    title: "Direct Messaging",
    description: "Communicate directly with brand managers. Clarify requirements and build long-term professional relationships.",
    icon: MessageSquare,
    color: "indigo",
    targetId: "sidebar-item-messages",
  },
];

const companySteps: Step[] = [
  {
    title: "Welcome to InfluBridge",
    description: "Connect with the perfect influencers for your brand campaigns. Let's show you how to get started!",
    icon: Sparkles,
    color: "yellow",
  },
  {
    title: "Create a Campaign",
    description: "Define your requirements, budget, and objectives. Reach thousands of influencers matching your brand values.",
    icon: Search,
    color: "blue",
    targetId: "sidebar-item-campaigns",
  },
  {
    title: "Review Applications",
    description: "Browse through influencer proposals, check their stats, and approve those who best fit your vision.",
    icon: UserCircle,
    color: "purple",
    targetId: "sidebar-item-applications",
  },
  {
    title: "Secure Payments",
    description: "Use our escrow system to fund your campaigns. Payments are only released once the work is delivered.",
    icon: Wallet,
    color: "emerald",
    targetId: "sidebar-item-billing",
  },
  {
    title: "Track Performance",
    description: "Monitor campaign results in real-time. See reach, engagement, and ROI for every collaboration.",
    icon: BarChart3,
    color: "orange",
    targetId: "sidebar-item-dashboard",
  },
];

const Spotlight = ({ targetId, isOpen }: { targetId?: string; isOpen: boolean }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen || !targetId) {
      setRect(null);
      return;
    }

    const update = () => {
      // Try desktop first, then mobile
      let el = document.getElementById(`desktop-${targetId}`);
      
      // Check if visible (offsetParent is null when display: none)
      if (!el || (el as HTMLElement).offsetParent === null) {
        el = document.getElementById(`mobile-${targetId}`);
      }
      
      if (el) {
        const clientRect = el.getBoundingClientRect();
        // Check if the element is actually visible in the viewport
        if (clientRect.width > 0 && clientRect.height > 0) {
          setRect(clientRect);
        } else {
          setRect(null);
        }
      } else {
        setRect(null);
      }
    };

    const timer = setTimeout(update, 200);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [targetId, isOpen]);

  if (!mounted) return null;

  return createReactPortal(
    <AnimatePresence>
      {isOpen && rect && rect.width > 0 && (
        <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute"
            style={{
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              borderRadius: "0.75rem",
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
            }}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: 1 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              scale: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }
            }}
            style={{
              position: "absolute",
              top: rect.top - 4,
              left: rect.left - 4,
              width: rect.width + 8,
              height: rect.height + 8,
              border: "4px solid white",
              borderRadius: "0.75rem",
              boxShadow: "0 0 30px rgba(255,255,255,0.3)",
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: "absolute",
              top: rect.top + rect.height / 2,
              left: rect.right + 24,
              transform: "translateY(-50%)",
            }}
          >
            <div className="bg-white text-black font-bold px-4 py-2 rounded-full shadow-xl border-2 border-black flex items-center gap-2 whitespace-nowrap">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span>Look here!</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const DashboardGuide = ({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = role === "COMPANY" ? companySteps : influencerSteps;
  const step = steps[currentStep];

  useEffect(() => {
    if (isOpen && step.targetId) {
      const timer = setTimeout(() => {
        let el = document.getElementById(`desktop-${step.targetId}`);
        
        if (!el || (el as HTMLElement).offsetParent === null) {
          el = document.getElementById(`mobile-${step.targetId}`);
        }
        
        if (el) {
          // Check if element is visible and has dimensions
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
             el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, step.targetId]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setTimeout(() => setCurrentStep(0), 500);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <Spotlight targetId={step?.targetId} isOpen={isOpen} />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className={cn(
            "p-0 overflow-hidden bg-white border-none rounded-[2.5rem] shadow-2xl transition-all duration-500 z-[110]",
            step.targetId ? "sm:max-w-[400px] sm:fixed sm:left-[60%] sm:top-1/2 sm:-translate-y-1/2" : "sm:max-w-[600px]"
          )}
        >
          <div className="sr-only">
            <DialogTitle>Dashboard Guide</DialogTitle>
            <DialogDescription>
              Learn how to use the {role === "COMPANY" ? "Brand" : "Influencer"} dashboard.
            </DialogDescription>
          </div>
          
          <div className="relative h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 flex gap-1 px-4 pt-10">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full flex-1 transition-all duration-500",
                    idx <= currentStep ? "bg-black" : "bg-gray-200"
                  )}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-20"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className={cn("p-10 pt-20", step.targetId ? "p-8 pt-16" : "p-10 pt-20")}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${role}-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        delay: 0.1 
                      }}
                      className={cn(
                        "rounded-[2rem] flex items-center justify-center shadow-lg relative",
                        step.targetId ? "w-16 h-16" : "w-24 h-24",
                        step.color === "yellow" ? "bg-yellow-50" : 
                        step.color === "blue" ? "bg-blue-50" :
                        step.color === "purple" ? "bg-purple-50" :
                        step.color === "emerald" ? "bg-emerald-50" :
                        step.color === "orange" ? "bg-orange-50" :
                        step.color === "pink" ? "bg-pink-50" : "bg-indigo-50"
                      )}
                    >
                      <div className={cn(
                        "absolute inset-0 rounded-[2rem] opacity-20 blur-xl",
                        step.color === "yellow" ? "bg-yellow-400" : 
                        step.color === "blue" ? "bg-blue-400" :
                        step.color === "purple" ? "bg-purple-400" :
                        step.color === "emerald" ? "bg-emerald-400" :
                        step.color === "orange" ? "bg-orange-400" :
                        step.color === "pink" ? "bg-pink-400" : "bg-indigo-400"
                      )} />
                      <step.icon className={cn(
                        step.targetId ? "w-6 h-6" : "w-10 h-10",
                        "relative z-10",
                        step.color === "yellow" ? "text-yellow-600" : 
                        step.color === "blue" ? "text-blue-600" :
                        step.color === "purple" ? "text-purple-600" :
                        step.color === "emerald" ? "text-emerald-600" :
                        step.color === "orange" ? "text-orange-600" :
                        step.color === "pink" ? "text-pink-600" : "text-indigo-600"
                      )} />
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className={cn(
                        "font-black text-black tracking-tight",
                        step.targetId ? "text-xl" : "text-3xl"
                      )}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-gray-500 font-medium leading-relaxed mx-auto",
                        step.targetId ? "text-sm max-w-[300px]" : "text-lg max-w-[400px]"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {!step.targetId && (
                    <div className="bg-gray-50 border-2 border-black/5 rounded-3xl p-6 h-40 flex items-center justify-center">
                       <div className="flex flex-col items-center gap-3">
                          <div className="w-32 h-2 bg-gray-200 rounded-full" />
                          <div className="w-48 h-2 bg-gray-200 rounded-full" />
                          <div className="w-24 h-8 bg-black/5 rounded-xl mt-2" />
                       </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-10">
                <Button
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={cn(
                    "py-4 px-4 font-bold rounded-2xl transition-all",
                    currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-gray-50"
                  )}
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mr-2">
                    {currentStep + 1} / {steps.length}
                  </span>
                  <Button
                    onClick={nextStep}
                    className="bg-black hover:bg-gray-800 text-white py-4 px-6 font-bold rounded-2xl shadow-soft transition-all hover:scale-[1.02] group"
                  >
                    {currentStep === steps.length - 1 ? (
                      "Got it!"
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
