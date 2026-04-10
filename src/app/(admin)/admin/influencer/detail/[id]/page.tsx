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
import { useIdParam } from "@/app/hooks/use-id-param";

export default function InfluencerProfile() {
  const id = useIdParam();
  const [activeTab, setActiveTab] = useQueryState("content-type");
  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["influencerDetail", id],
    queryFn: () => {
      return graphqlClient.request(QUERY, { userId: id });
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
    <section className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <InfluencerProfileHeaderSection data={data?.influencerByUser || null} />

        <InfluencerProfileNicheSection data={data?.influencerByUser || null} />

        <InfluencerProfileContentTabSection
          data={data?.influencerByUser || null}
          active={activeTab || "posts"}
          setActiveTab={setActiveTab}
        />

        <InfluencerProfileSocialNetworkSection
          data={data?.influencerByUser || null}
        />

        <InfluencerProfileContentTypeSection
          data={data?.influencerByUser || null}
        />
      </div>
    </section>
  );
}