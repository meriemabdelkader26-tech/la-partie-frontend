"use client";
import { useQuery } from "@tanstack/react-query";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState as useSearchParamsState,
} from "nuqs";
import { graphqlClient } from "@/lib/graphql-client";
import DataTableCategory from "./_components/DataTableCategory";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { CATEGORIES_KEY, ITEMS_PER_PAGE } from "@/constant";
import { DataType, QUERY } from "./_components/query";
import Filter from "./_components/Filter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [page, setPage] = useSearchParamsState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const [search, setSearch] = useSearchParamsState(
    "search",
    parseAsString.withDefault("")
  );

  const [isActiveFilter, setIsActiveFilter] = useSearchParamsState(
    "isActive",
    parseAsStringEnum(["true", "false", "all"]).withDefault("all")
  );

  const [orderBy, setOrderBy] = useSearchParamsState(
    "orderBy",
    parseAsStringEnum(["name", "-name", "created", "-created"]).withDefault(
      "name"
    )
  );

  const { isFetching, data } = useQuery<DataType>({
    queryKey: [CATEGORIES_KEY, page, search, isActiveFilter, orderBy],
    queryFn: () => {
      return graphqlClient.request(QUERY, {
        first: ITEMS_PER_PAGE,
        offset: (page - 1) * ITEMS_PER_PAGE,
        nameIstartswith: search || undefined,
        isActive:
          isActiveFilter === "all" ? undefined : isActiveFilter === "true",
        orderBy: orderBy,
      });
    },
  });

  const totalItems = data?.allCategories?.totalCount ?? 0;
  const hasNextPage = data?.allCategories?.pageInfo?.hasNextPage ?? false;
  const hasPreviousPage =
    data?.allCategories?.pageInfo?.hasPreviousPage ?? false;

  const hasActiveFilters =
    search !== "" || isActiveFilter !== "all" || orderBy !== "name";

  const clearFilters = () => {
    setSearch("");
    setIsActiveFilter("all");
    setOrderBy("name");
    setPage(1);
  };

  return (
    <section className="min-h-screen w-full flex flex-col items-start justify-start bg-background p-0">
      <div className="flex items-center justify-between w-full px-8 pt-8 pb-4">
        <h1 className="text-2xl font-semibold text-title flex items-center gap-2">
          <span>Categories</span>
          <span className="text-base font-medium text-muted">({totalItems})</span>
        </h1>
        <Button
          onClick={() => router.push("/admin/category/create-category")}
          className="bg-primary hover:bg-primary-light text-white rounded-lg px-5 py-2 font-medium shadow-soft border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="w-full px-8">
        <Filter
          search={search}
          setSearch={setSearch}
          setPage={setPage}
          isActiveFilter={isActiveFilter}
          setIsActiveFilter={setIsActiveFilter}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
      </div>
      <div className="w-full flex flex-col items-center px-8 pt-4">
        <div className="w-full max-w-5xl bg-white rounded-[16px] shadow-soft p-0">
          <DataTableCategory
            isLoading={isFetching}
            orderBy={orderBy}
            onOrderChange={(newOrderBy) => {
              setOrderBy(newOrderBy as "name" | "-name" | "created" | "-created");
              setPage(1);
            }}
            paginationProps={{
              advanced: {
                totalItems,
                onPageChange: setPage,
                pageIndex: page,
                itemsPerPage: ITEMS_PER_PAGE,
              },
              isNextDisabled: !hasNextPage,
              isPreviousDisabled: !hasPreviousPage,
              onNextClick: () => setPage(page + 1),
              onPreviousClick: () => setPage(page - 1),
            }}
            items={data?.allCategories?.edges.map((edge) => edge.node) || []}
          />
        </div>
      </div>
    </section>
  );
}