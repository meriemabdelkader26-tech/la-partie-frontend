"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { InfluencerDetailDataType, GET_INFLUENCER_BY_USER_QUERY } from "./_components/query";
import Loading from "@/app/loading";
import { useQueryState } from "nuqs";
import InfluencerProfileHeaderSection from "./_components/InfluencerProfileHeaderSection";
import InfluencerProfileNicheSection from "./_components/InfluencerProfileNicheSection";
import InfluencerProfileSocialNetworkSection from "./_components/InfluencerProfileSocialNetworkSection";
import InfluencerProfileContentTabSection from "./_components/InfluencerProfileContentTabSection";
import InfluencerProfileContentTypeSection from "./_components/InfluencerProfileContentTypeSection";
import { useId } from "@/app/hooks/use-id";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BreadCrumbList from "@/components/shared/BreadCrumbList";

export default function InfluencerProfile() {
  const id = useId();
  const router = useRouter();
  const [activeTab, setActiveTab] = useQueryState("content-type");
  const { isFetching, data } = useQuery<InfluencerDetailDataType>({
    queryKey: ["influencerDetail", id],
    queryFn: () => {
      return graphqlClient.request(GET_INFLUENCER_BY_USER_QUERY, { userId: id });
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (!activeTab) {
      setActiveTab("posts");
    }
  }, [activeTab, setActiveTab]);

  if (isFetching) {
    return <Loading />;
  }

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
              Influencer Profile
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-14 mt-1">
            Viewing detailed analysis and profile for <span className="text-emerald-600 font-bold">{data?.influencerByUser?.pseudo || "Influencer"}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Influencers", href: "/admin/influencer" },
            { label: data?.influencerByUser?.pseudo || "Detail", href: `/admin/influencer/detail/${id}` },
          ]}
        />
      </div>

      <div className="w-full space-y-8">
        <InfluencerProfileHeaderSection data={data?.influencerByUser || null} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <InfluencerProfileContentTabSection
              data={data?.influencerByUser || null}
              active={activeTab || "posts"}
              setActiveTab={setActiveTab}
            />
            
            <InfluencerProfileContentTypeSection
              data={data?.influencerByUser || null}
            />
          </div>

          <div className="space-y-8">
            <InfluencerProfileNicheSection data={data?.influencerByUser || null} />
            
            <InfluencerProfileSocialNetworkSection
              data={data?.influencerByUser || null}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}