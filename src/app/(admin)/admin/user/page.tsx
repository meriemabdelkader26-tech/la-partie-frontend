"use client";
import { useQuery } from "@tanstack/react-query";
import {
  parseAsInteger,
  parseAsString,
  useQueryState as useSearchParamsState,
} from "nuqs";
import { DataType, QUERY } from "./_components/constant";
import { graphqlClient } from "@/lib/graphql-client";
import { ITEMS_PER_PAGE, USERS_KEY } from "@/constant";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import DataTableUser from "./_components/DataTableUser";
import { UserFilterBar } from "@/app/(admin)/admin/user/_components/UserFilterBar";
import { motion } from "framer-motion";

const Page = () => {
  const [page, setPage] = useSearchParamsState(
    "page",
    parseAsInteger.withDefault(1)
  );

  const [search, setSearch] = useSearchParamsState(
    "search",
    parseAsString.withDefault("")
  );

  const [role, setRole] = useSearchParamsState(
    "role",
    parseAsString.withDefault("")
  );

  const [verification, setVerification] = useSearchParamsState(
    "verification",
    parseAsString.withDefault("")
  );

  const [banned, setBanned] = useSearchParamsState(
    "banned",
    parseAsString.withDefault("")
  );

  const [active, setActive] = useSearchParamsState(
    "active",
    parseAsString.withDefault("")
  );

  const [orderBy, setOrderBy] = useSearchParamsState(
    "orderBy",
    parseAsString.withDefault("-created_at")
  );

  const buildQueryVariables = () => {
    const variables: any = {
      first: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      orderBy: orderBy,
    };
    if (role && role !== "") {
      variables.role = role;
    }
    if (search && search !== "") {
      variables.search = search;
    }

    if (verification === "verified") {
      variables.isVerifyByAdmin = true;
    } else if (verification === "not_verified") {
      variables.isVerifyByAdmin = false;
    }

    if (banned === "true") {
      variables.isBanned = true;
    } else if (banned === "false") {
      variables.isBanned = false;
    }

    if (active === "true") {
      variables.isActive = true;
    } else if (active === "false") {
      variables.isActive = false;
    }

    return variables;
  };

  const { isFetching, data } = useQuery<DataType>({
    queryKey: [
      USERS_KEY,
      page,
      search,
      role,
      verification,
      banned,
      active,
      orderBy,
    ],
    queryFn: () => {
      return graphqlClient.request(QUERY, buildQueryVariables());
    },
  });

  const totalItems = data?.allUsers?.totalCount ?? 0;
  const hasNextPage = data?.allUsers?.pageInfo?.hasNextPage ?? false;
  const hasPreviousPage = data?.allUsers?.pageInfo?.hasPreviousPage ?? false;

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
              Users Management
            </h1>
            <span className="bg-emerald-100 text-emerald-700 py-1 px-3 rounded-full text-sm font-bold shadow-sm ml-2">
              {totalItems} Total
            </span>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Manage influencers, companies, and their verification statuses.
          </p>
        </div>
      </div>
      
      <div className="mb-2 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Users", href: "/admin/user" },
          ]}
        />
      </div>

      <div className="w-full bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <UserFilterBar
          searchQuery={search}
          setSearchQuery={(value) => {
            setSearch(value);
            setPage(1);
          }}
          filterRole={role}
          setFilterRole={(value) => {
            setRole(value || "");
            setPage(1);
          }}
          filterVerification={verification}
          setFilterVerification={(value) => {
            setVerification(value || "");
            setPage(1);
          }}
          filterBanned={banned}
          setFilterBanned={(value) => {
            setBanned(value || "");
            setPage(1);
          }}
          filterActive={active}
          setFilterActive={(value) => {
            setActive(value || "");
            setPage(1);
          }}
          hasActiveFilters={
            search !== "" ||
            role !== "" ||
            verification !== "" ||
            banned !== "" ||
            active !== ""
          }
          clearFilters={() => {
            setSearch("");
            setRole("");
            setVerification("");
            setBanned("");
            setActive("");
            setPage(1);
          }}
        />
      </div>

      <div className="w-full">
        <DataTableUser
          isLoading={isFetching}
          orderBy={orderBy}
          onOrderChange={(newOrderBy) => {
            setOrderBy(newOrderBy);
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
          items={data?.allUsers?.edges.map((edge) => edge.node) || []}
        />
      </div>
    </motion.section>
  );
};

export default Page;