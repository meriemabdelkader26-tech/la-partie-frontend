"use client";

import { useQuery } from "@tanstack/react-query";
import { GET_SAVED_OFFERS, DataType } from "../offer/_components/query";
import { graphqlClient } from "@/lib/graphql-client";
import { OfferGrid } from "../offer/_components/OfferGrid";
import { Star } from "lucide-react";

export default function SavedOffersPage() {
  const { data, isFetching } = useQuery<DataType>({
    queryKey: ["savedOffers"],
    queryFn: () => {
      return graphqlClient.request(GET_SAVED_OFFERS, { first: 100 });
    },
  });

  const savedOffers = data?.savedOffers?.edges.map((edge) => edge.node) || [];

  return (
    <section className="animate-fadeIn">
      <div className="mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fadeInDown">
          <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-soft">
            <Star className="w-6 h-6 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-black tracking-tight">Saved Offers</h1>
            <p className="text-sm font-bold text-gray-400">Keep track of opportunities you're interested in</p>
          </div>
        </div>

        <div className="animate-fadeInUp delay-200">
          {savedOffers.length > 0 ? (
            <OfferGrid
              offers={savedOffers}
              isLoading={isFetching}
              itemsPerPage={100}
            />
          ) : !isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-black/5 rounded-[40px] text-center px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                <Star className="w-10 h-10 text-gray-200" />
              </div>
              <h2 className="text-2xl font-black text-black mb-2">No saved offers yet</h2>
              <p className="text-gray-400 font-medium max-w-sm">
                Star offers that catch your eye while browsing to see them here later.
              </p>
            </div>
          ) : (
            <OfferGrid
              offers={[]}
              isLoading={true}
              itemsPerPage={8}
            />
          )}
        </div>
      </div>
    </section>
  );
}
