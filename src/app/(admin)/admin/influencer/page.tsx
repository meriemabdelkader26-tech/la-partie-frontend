"use client";

import { INFLUENCERS_KEY } from "@/constant";
import InfluencerFilters from "./_components/InfluencerFilters";
import { useQuery } from "@tanstack/react-query";
import { DataType, QUERY } from "./_components/query";
import { graphqlClient } from "@/lib/graphql-client";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import InfluencerGrid from "./_components/InfluencerGrid";
import AdvancedPagination from "@/components/ui/advanced-pagination";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 12;

const Page = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [disponibilite, setDisponibilite] = useQueryState(
    "disponibilite",
    parseAsString
  );
  const [maxEngagement, setMaxEngagement] = useQueryState(
    "maxEngagement",
    parseAsString
  );
  const [maxFollowers, setMaxFollowers] = useQueryState(
    "maxFollowers",
    parseAsString
  );
  const [ordering, setOrdering] = useQueryState("ordering", parseAsString);
  const [startDate, setStartDate] = useQueryState<Date | null>("startDate", {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => (value ? value.toISOString() : ""),
  });
  const [endDate, setEndDate] = useQueryState<Date | null>("endDate", {
    parse: (value) => (value ? new Date(value) : null),
    serialize: (value) => (value ? value.toISOString() : ""),
  });

  const buildQueryVariables = () => {
    const variables: any = {
      first: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    };

    if (searchQuery) {
      variables.userName = searchQuery;
    }
    if (disponibilite) {
      variables.disponibiliteCollaboration = disponibilite;
    }
    if (maxEngagement) {
      variables.maxEngagement = parseFloat(maxEngagement);
    }
    if (maxFollowers) {
      variables.maxFollowers = parseInt(maxFollowers);
    }
    if (ordering) {
      variables.ordering = ordering;
    }

    return variables;
  };

  const { isFetching, data } = useQuery<DataType>({
    queryKey: [
      INFLUENCERS_KEY,
      page,
      searchQuery,
      disponibilite,
      maxEngagement,
      maxFollowers,
      ordering,
    ],
    queryFn: () => {
      return graphqlClient.request(QUERY, buildQueryVariables());
    },
  });

  const allInfluencers =
    data?.allInfluencers.edges.map((edge) => edge.node) || [];

  const totalItems = data?.allInfluencers.totalCount || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || null);
    setPage(1);
  };

  const activeFiltersCount = [
    disponibilite,
    maxEngagement,
    maxFollowers,
    ordering,
    startDate,
    endDate,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    setDisponibilite(null);
    setMaxEngagement(null);
    setMaxFollowers(null);
    setOrdering(null);
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-start justify-start w-full p-4 md:p-8"
    >
      <div className="w-full mb-6">
        <InfluencerFilters
          activeFiltersCount={activeFiltersCount}
          onClearAll={handleClearAll}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          startDate={startDate}
          endDate={endDate}
          disponibilite={disponibilite}
          maxEngagement={maxEngagement}
          maxFollowers={maxFollowers}
          ordering={ordering}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          setDisponibilite={setDisponibilite}
          setMaxEngagement={setMaxEngagement}
          setMaxFollowers={setMaxFollowers}
          setOrdering={setOrdering}
          setPage={setPage}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>

      <div className="w-full">
        <InfluencerGrid
          influencers={allInfluencers}
          isLoading={isFetching}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {!isFetching && totalItems > 0 && (
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between w-full">
          <div className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{allInfluencers.length}</span> influencers
          </div>
          
          <div className="flex items-center gap-2">
            <AdvancedPagination
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
              pageIndex={page}
              pageCount={totalPages}
              onPageChange={handlePageChange}
              ModulePaginationColor="bg-emerald-500"
            />
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default Page;