"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useSessionStore } from "@/stores/use-session-store";

const HomeNavbar = () => {
  const router = useRouter();
  const { isLoggedIn, currentUser } = useSessionStore();

  const getDashboardLink = () => {
    if (!currentUser) return "/login";
    if (currentUser.isStaff || currentUser.role === 'ADMIN') return "/admin/category";
    if (currentUser.role === 'COMPANY') return "/company";
    return "/influencer";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-black/10 animate-fadeInDown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group">
          <div className="text-2xl md:text-3xl font-black text-black tracking-tight hover:scale-105 transition-transform duration-300">
            {APP_NAME}
            <span className="inline-block w-2 h-2 bg-black rounded-full ml-1 group-hover:animate-pulse"></span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Link href={getDashboardLink()}>
              <Button 
                className="bg-black hover:bg-gray-800 text-white transition-all duration-300 rounded-xl px-6 shadow-medium hover:shadow-large hover:scale-105 font-bold"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black hover:text-white bg-transparent transition-all duration-300 rounded-xl px-6"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register?role=influencer">
                <Button 
                  className="bg-black hover:bg-gray-800 text-white transition-all duration-300 rounded-xl px-6 shadow-medium hover:shadow-large hover:scale-105"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:bg-black/5 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;