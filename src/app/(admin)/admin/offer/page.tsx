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

      if (searchQuery) variables.title = searchQuery;
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
    <section>
      <div className="mx-auto px-6 py-8">
        <OfferFilters
          activeFiltersCount={activeFiltersCount}
          onClearAll={clearAllFilters}
        />

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1">
            <OfferSearchBar
              value={searchQuery || ""}
              onChange={handleSearchChange}
            />
          </div>
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

        <OfferGrid
          offers={currentOffers}
          isLoading={isFetching}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {!isFetching && totalItems > 0 && (
        <div className="h-16 border-t border-slate-700 flex">
          <div className="flex items-center justify-between w-full px-5">
            <AdvancedPagination
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={totalItems}
              pageIndex={page}
              pageCount={totalPages}
              onPageChange={handlePageChange}
              ModulePaginationColor="green"
            />
          </div>
        </div>
      )}
    </section>
  );
}