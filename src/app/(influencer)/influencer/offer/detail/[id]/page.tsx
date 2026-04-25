"use client";
import { useEffect, useState } from "react";
import OfferDetailHeader from "./_components/OfferDetailHeader";
import OfferDetailOverview from "./_components/OfferDetailOverview";
import OfferDetailRequirements from "./_components/OfferDetailRequirements";
import OffferDetailContentType from "./_components/OffferDetailContentType";
import OfferDetailApply from "./_components/OfferDetailApply";
import OfferDetailStat from "./_components/OfferDetailStat";
import OfferDetailContact from "./_components/OfferDetailContact";
import { useQuery } from "@tanstack/react-query";
import { DataType, QUERY } from "./_components/query";
import { useIdParam } from "@/app/hooks/use-id-param";
import { graphqlClient } from "@/lib/graphql-client";
import Loading from "@/app/loading";
import { useSessionStore } from "@/stores/use-session-store";

const page = () => {
  const id = useIdParam();
  const [hasApplied, setHasApplied] = useState<boolean>(false);
  const { currentUser } = useSessionStore();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["influencerDetail", id],
    queryFn: () => {
      return graphqlClient.request(QUERY, { id });
    },
    enabled: !!id,
  });

  const offer = data?.offer!;

  const handleApplicationSuccess = () => {
    setHasApplied(true);
  };

  useEffect(() => {
    if (currentUser && offer) {
      const applied = offer.applications?.some(
        (application) => application.user.id === currentUser.id
      );

      setHasApplied(applied!);
    }
  }, [currentUser, offer]);

  if (isFetching) {
    return <Loading />;
  }

  if (!offer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Offer Not Found</h2>
          <p className="text-gray-600">The offer you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen animate-fadeIn">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="animate-fadeInDown">
          <OfferDetailHeader offer={offer} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8 animate-slideInLeft delay-200">
            <OfferDetailOverview offer={offer} />
            <OfferDetailRequirements offer={offer} />
            <OffferDetailContentType />
          </div>
          <div className="space-y-8 animate-slideInRight delay-300">
            <OfferDetailApply
              offer={offer}
              hasApplied={hasApplied}
              onSuccess={handleApplicationSuccess}
            />
            <OfferDetailStat offer={offer} />
            <OfferDetailContact />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
