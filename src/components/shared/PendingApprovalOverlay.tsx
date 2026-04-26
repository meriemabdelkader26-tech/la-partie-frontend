"use client";

import { useSessionStore } from "@/stores/use-session-store";
import { LogOut, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const PendingApprovalOverlay = () => {
  const { signOut, currentUser } = useSessionStore();

  if (!currentUser || currentUser.isVerifyByAdmin || currentUser.isStaff || currentUser.role === 'ADMIN') {
    return null;
  }

  const handleLogout = () => {
    signOut();
    window.location.href = "/login";
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/5 rounded-full blur-3xl animate-float delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/3 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white border-2 border-black/5 rounded-[40px] shadow-2xl p-10 text-center space-y-8 hover:shadow-3xl transition-all duration-500">
          {/* Status Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-black rounded-3xl rotate-6 opacity-5 animate-pulse"></div>
            <div className="absolute inset-0 bg-black rounded-3xl -rotate-6 opacity-5 animate-pulse delay-75"></div>
            <div className="relative bg-black rounded-3xl w-full h-full flex items-center justify-center shadow-2xl group hover:scale-110 transition-transform duration-500">
              <Clock className="w-10 h-10 text-white animate-spin-slow" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/5 rounded-full text-black text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Account Pending
            </div>
            <h1 className="text-3xl font-black text-black tracking-tight leading-tight">
              Wait till admin approves your account
            </h1>
            <p className="text-gray-500 font-medium text-base">
              Hi {currentUser?.name || "there"}! We've received your profile information. Our team is currently reviewing it to ensure the best experience for everyone.
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-6 border border-black/5 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">Reviewing Profile</p>
                <p className="text-xs text-gray-500">Usually takes less than 24 hours</p>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <p className="text-xs text-gray-400 font-medium">
              You'll receive an email once your account is activated.
            </p>
            <Button
              onClick={handleLogout}
              className="w-full h-14 bg-black hover:bg-gray-800 text-white rounded-2xl font-bold text-base shadow-medium hover:shadow-large transition-all duration-300 flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Logout from account
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
