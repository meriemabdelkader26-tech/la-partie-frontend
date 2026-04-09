"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeNavbar = () => {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-green-400">{APP_NAME}</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-slate-700 bg-transparent"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register?role=influencer">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;