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
    <section className="min-h-screen  flex flex-col items-start justify-start">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-white">
            Categories&nbsp;
            <span className="text-sm font-medium text-emerald-400">
              ({totalItems})
            </span>
          </h1>
        </div>
        <Button
          onClick={() => router.push("/admin/category/create-category")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Category", href: "/admin/category" },
        ]}
      />

      <Filter
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        isActiveFilter={isActiveFilter}
        setIsActiveFilter={setIsActiveFilter}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <div className="flex items-center justify-between gap-2 w-full">
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
    </section>
  );
}