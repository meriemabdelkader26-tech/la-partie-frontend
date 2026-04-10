"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { useId } from "@/app/hooks/use-id";
import UpdateFormOffer from "./_components/UpdateFormOffer";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { Offer } from "@/app/types";
import Loading from "@/app/loading";

const page = () => {
  const offerId = useId();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["OFFERS_KEY", offerId],
    enabled: !!offerId,
    queryFn: () => {
      return graphqlClient.request(QUERY, {
        id: offerId,
      });
    },
  });

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-white">Update Offer</h1>
        </div>
      </div>

      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Offer", href: "/admin/offer" },
          { label: "Update Offer", href: "/admin/offer/update-offer" },
        ]}
      />

      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-white">Offer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateFormOffer
            offerId={offerId}
            offer={data?.offer ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;

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