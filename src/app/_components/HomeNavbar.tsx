"use client";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeNavbar = () => {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 bg-pastel-dark-blue/80 backdrop-blur border-b border-pastel-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-pastel-green">{APP_NAME}</div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-pastel-green text-pastel-green hover:bg-pastel-blue bg-transparent"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register?role=influencer">
            <Button variant="outline"
            className=" bg-pastel-green hover:bg-pastel-red text-pastel-dark-blue">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;