"use client";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { useId } from "@/app/hooks/use-id";
import UpdateFormOffer from "./_components/UpdateFormOffer";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { Offer } from "@/app/types";
import Loading from "@/app/loading";
import { motion } from "framer-motion";
import { Edit3, ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OFFERS_KEY } from "@/constant";

const Page = () => {
  const offerId = useId();
  const router = useRouter();

  const { isLoading, data } = useQuery<DataType>({
    queryKey: [OFFERS_KEY, offerId],
    enabled: !!offerId,
    queryFn: () => {
      return graphqlClient.request(QUERY, {
        id: offerId,
      });
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const offer = data?.offer;

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-8">
        <div className="bg-amber-50 border border-amber-100 p-10 rounded-[32px] flex flex-col items-center text-center max-w-md shadow-sm">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Offer Not Found</h2>
          <p className="text-gray-500 font-medium mb-8">
            The campaign you are trying to edit does not exist or you don't have permission to modify it.
          </p>
          <Button 
            onClick={() => router.push("/admin/offer")}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold h-12 rounded-xl"
          >
            Back to Offers
          </Button>
        </div>
      </div>
    );
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
              Update Campaign
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-14 mt-1">
            Modifying details for <span className="text-emerald-600 font-bold">{offer?.title}</span>
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Offers", href: "/admin/offer" },
            { label: "Update Offer", href: `/admin/offer/update-offer/${offerId}` },
          ]}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden">
          <div className="p-6 md:p-10 border-b border-gray-50 bg-gray-50/50 flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-50">
              <Edit3 className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Campaign Information</h2>
              <p className="text-gray-500 text-sm font-medium">Update the requirements, budget or schedule for this offer.</p>
            </div>
          </div>
          <div className="p-6 md:p-10">
            <UpdateFormOffer
              offerId={offerId}
              offer={offer ?? null}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Page;

const QUERY = `
query GetOfferById($id: ID!) {
  offer(id: $id) {
    id
    title
    objectif
    influencerNumber
    minBudget
    maxBudget
    startDate
    endDate
    requirement
    createdAt
    createdBy {
      id
      name
    }
  }
}
`;

type DataType = {
  offer: Offer;
};
