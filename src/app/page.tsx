"use client";
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
  return (
    <main className="min-h-screen pageBackgroundColor">
      <HomeNavbar />
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
    </main>
  );
}
