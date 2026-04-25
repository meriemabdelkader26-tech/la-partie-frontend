"use client";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import CreateFormOffer from "./_components/CreateFormOffer";
import { motion } from "framer-motion";
import { Briefcase, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateOfferPage() {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-start justify-start w-full p-4 md:p-8"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-xl hover:bg-gray-100 h-9 w-9 mr-1"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Button>
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Create Campaign
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-14 mt-1">
            Set up a new collaboration offer for influencers.
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Offers", href: "/admin/offer" },
            { label: "Create Offer", href: "/admin/offer/create" },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50 flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
              <Briefcase className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Campaign Details</h2>
              <p className="text-gray-500 text-sm font-medium">Fill in the requirements and budget for your new campaign.</p>
            </div>
          </div>
          <div className="p-6 md:p-10">
            <CreateFormOffer />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
