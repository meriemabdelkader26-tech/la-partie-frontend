"use client";
import { useEffect } from "react";
import { useSessionStore } from "@/stores/use-session-store";
import HomeNavbar from "./_components/HomeNavbar";
import HomeHero from "./_components/HomeHero";
import HomeService from "./_components/HomeService";
import HomeFeature from "./_components/HomeFeature";
import HomeTestimonials from "./_components/HomeTestimonials";
import HomeTopCompanies from "./_components/HomeTopCompanies";
import HomeCarousel from "./_components/HomeCarousel";
import HomeStatistics from "./_components/HomeStatistics";
import HomeCTA from "./_components/HomeCTA";
import HomeFooter from "./_components/HomeFooter";
import HomeTrendingInfluencer from "./_components/HomeTrendingInfluencer";

export default function Home() {
  const { isLoggedIn, signOut } = useSessionStore();

  useEffect(() => {
    // If we're on the home page and not logged in according to our store,
    // ensure all cookies are cleared to prevent "ghost" sessions.
    if (!isLoggedIn) {
      signOut();
    }
  }, [isLoggedIn, signOut]);

  return (
    <main className="min-h-screen pageBackgroundColor">
      <HomeNavbar />
      {/* Add padding top to account for fixed navbar */}
      <div className="pt-16">
        <HomeHero />
        <HomeService />
        <HomeFeature />
        <HomeTestimonials />
        <HomeTopCompanies />
        <HomeTrendingInfluencer />
        <HomeCarousel />
        <HomeStatistics />
        <HomeCTA />
        <HomeFooter />
      </div>
    </main>
  );
}
