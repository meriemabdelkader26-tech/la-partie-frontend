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
import { motion } from "framer-motion";

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
        search: search || undefined,
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
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-start justify-start w-full p-4 md:p-8"
    >
      <div className="flex items-center justify-between w-full mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Categories
            </h1>
            <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm ml-2">
              {totalItems} Total
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Manage your application categories and organization.
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/category/create-category")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 h-11 font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="mb-2 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Categories", href: "/admin/category" },
          ]}
        />
      </div>

      <div className="w-full bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
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

      <div className="w-full">
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
    </motion.section>
  );
}