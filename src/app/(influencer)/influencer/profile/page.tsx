"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { DataType, QUERY } from "./_components/query";
import Loading from "@/app/loading";
import { useQueryState } from "nuqs";
import InfluencerProfileHeaderSection from "./_components/InfluencerProfileHeaderSection";
import InfluencerProfileNicheSection from "./_components/InfluencerProfileNicheSection";
import InfluencerProfileSocialNetworkSection from "./_components/InfluencerProfileSocialNetworkSection";
import InfluencerProfileContentTabSection from "./_components/InfluencerProfileContentTabSection";
import InfluencerProfileContentTypeSection from "./_components/InfluencerProfileContentTypeSection";

export default function InfluencerProfile() {
  const [activeTab, setActiveTab] = useQueryState("content-type");
  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["influencerProfile"],
    queryFn: () => {
      return graphqlClient.request(QUERY);
    },
  });

  useEffect(() => {
    if (!activeTab) {
      setActiveTab("posts");
    }
  }, [activeTab, setActiveTab]);

  if (isFetching) {
    return <Loading />;
  }

  const profile = data?.myInfluencerProfile;

  return (
    <section className="min-h-screen bg-gray-50/30">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {!profile && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white border-2 border-dashed border-black/10 rounded-[40px]">
            <p className="text-gray-400 font-bold text-xl">Profile not found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-[40px] overflow-hidden shadow-soft border-2 border-black/5">
              <InfluencerProfileHeaderSection
                data={profile}
              />
            </div>

            <InfluencerProfileNicheSection
              data={profile || null}
            />

            <InfluencerProfileContentTabSection
              data={profile || null}
              active={activeTab || "posts"}
              setActiveTab={setActiveTab}
            />

            <InfluencerProfileSocialNetworkSection
              data={profile || null}
            />

            <InfluencerProfileContentTypeSection
              data={profile || null}
            />
          </>
        )}
      </div>
    </section>
  );
}
