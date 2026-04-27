"use client";
import {
  parseAsInteger,
  parseAsString,
  parseAsIsoDateTime,
  useQueryState,
} from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { DataType, QUERY } from "./_components/query";
import { graphqlClient } from "@/lib/graphql-client";
import { OFFERS_KEY } from "@/constant";
import { format } from "date-fns";
import AdvancedPagination from "@/components/ui/advanced-pagination";
import { OfferFilters } from "./_components/OfferFilters";
import { OfferSearchBar } from "./_components/OfferSearchBar";
import { OfferGrid } from "./_components/OfferGrid";
import OfferSheet from "./_components/OfferSheet";
import { calculateBudgetRange } from "@/lib/utils";
import { motion } from "framer-motion";

const ITEMS_PER_PAGE = 8;

export default function OffersPage() {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [filterBudgetRange, setFilterBudgetRange] = useQueryState(
    "budgetRange",
    parseAsString
  );
  const [minBudget, setMinBudget] = useQueryState(
    "minBudget",
    parseAsString.withDefault("")
  );
  const [maxBudget, setMaxBudget] = useQueryState(
    "maxBudget",
    parseAsString.withDefault("")
  );
  const [startDate, setStartDate] = useQueryState(
    "startDate",
    parseAsIsoDateTime
  );
  const [endDate, setEndDate] = useQueryState("endDate", parseAsIsoDateTime);
  const [ordering, setOrdering] = useQueryState(
    "ordering",
    parseAsString.withDefault("")
  );

  const { isFetching, data } = useQuery<DataType>({
    queryKey: [
      OFFERS_KEY,
      searchQuery,
      minBudget,
      maxBudget,
      startDate,
      endDate,
      ordering,
    ],
    queryFn: () => {
      const variables: Record<string, any> = {};

      if (searchQuery) variables.search = searchQuery;
      if (minBudget) variables.minBudget = parseFloat(minBudget);
      if (maxBudget) variables.maxBudget = parseFloat(maxBudget);
      if (startDate) variables.startDate = format(startDate, "yyyy-MM-dd");
      if (endDate) variables.endDate = format(endDate, "yyyy-MM-dd");
      if (ordering) variables.ordering = ordering;

      return graphqlClient.request(QUERY, variables);
    },
  });
  const allOffers = data?.allOffers.edges.map((edge) => edge.node) || [];
  const filteredOffers = filterBudgetRange
    ? allOffers.filter((offer) => {
        const range = calculateBudgetRange(offer.minBudget, offer.maxBudget);
        return range === filterBudgetRange;
      })
    : allOffers;

  const totalItems = filteredOffers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOffers = filteredOffers.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value || null);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAllFilters = () => {
    setSearchQuery(null);
    setFilterBudgetRange(null);
    setMinBudget(null);
    setMaxBudget(null);
    setStartDate(null);
    setEndDate(null);
    setOrdering(null);
    setPage(1);
  };

  const activeFiltersCount = [
    searchQuery,
    filterBudgetRange,
    minBudget,
    maxBudget,
    startDate,
    endDate,
    ordering,
  ].filter(Boolean).length;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-start justify-start w-full p-4 md:p-8"
    >
      <div className="w-full mb-6">
        <OfferFilters
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
          totalItems={totalItems}
        />
      </div>

      <div className="w-full bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <OfferSearchBar
            value={searchQuery || ""}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <OfferSheet
            activeFiltersCount={activeFiltersCount}
            filterBudgetRange={filterBudgetRange}
            minBudget={minBudget}
            maxBudget={maxBudget}
            ordering={ordering}
            startDate={startDate}
            endDate={endDate}
            totalItems={totalItems}
            startIndex={startIndex}
            endIndex={endIndex}
            setFilterBudgetRange={setFilterBudgetRange}
            setMinBudget={setMinBudget}
            setMaxBudget={setMaxBudget}
            setOrdering={setOrdering}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setPage={setPage}
            onClearAll={clearAllFilters}
          />
        </div>
      </div>

      <div className="w-full">
        <OfferGrid
          offers={currentOffers}
          isLoading={isFetching}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {!isFetching && totalItems > 0 && (
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between w-full gap-4">
          <div className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{currentOffers.length}</span> of <span className="font-bold text-gray-900">{totalItems}</span> offers
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
}