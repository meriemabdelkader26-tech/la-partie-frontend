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

  return (
    <section className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <InfluencerProfileHeaderSection
          data={data?.myInfluencerProfile || null}
        />

        <InfluencerProfileNicheSection
          data={data?.myInfluencerProfile || null}
        />

        <InfluencerProfileContentTabSection
          data={data?.myInfluencerProfile || null}
          active={activeTab || "posts"}
          setActiveTab={setActiveTab}
        />

        <InfluencerProfileSocialNetworkSection
          data={data?.myInfluencerProfile || null}
        />

        <InfluencerProfileContentTypeSection
          data={data?.myInfluencerProfile || null}
        />
      </div>
    </section>
  );
}
