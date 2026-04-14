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

const page = () => {
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
      variables.nameIcontains = search;
      variables.emailIcontains = search;
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
    <section className="min-h-screen flex flex-col items-start justify-start">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-black">
            Users&nbsp;
            <span className="text-sm font-medium text-emerald-400">
              ({totalItems})
            </span>
          </h1>
        </div>
      </div>
      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "User", href: "/admin/user" },
        ]}
      />

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

      <div className="flex items-center justify-between gap-2 w-full">
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
    </section>
  );
};

export default page;