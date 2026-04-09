"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeNavbar = () => {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 bg-rose-50/80 backdrop-blur border-b border-rose-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-pink-400">{APP_NAME}</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-rose-200 bg-transparent"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
