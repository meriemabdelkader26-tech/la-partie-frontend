"use client";

import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { useId } from "@/app/hooks/use-id";
import UpdateFormCategory from "./_components/UpdateFormCategory";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { Category } from "@/app/types";
import { CATEGORIES_KEY } from "@/constant";
import Loading from "@/app/loading";
import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";

const Page = () => {
  const categoryId = useId();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: [CATEGORIES_KEY, categoryId],
    enabled: !!categoryId,
    queryFn: () => {
      return graphqlClient.request(QUERY, {
        id: categoryId,
      });
    },
  });

  if (isFetching) {
    return <Loading />;
  }

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
              Update Category
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Modify the details and status of an existing category.
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Categories", href: "/admin/category" },
            { label: "Update Category", href: `/admin/category/update-category/${categoryId}` },
          ]}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
              <p className="text-gray-500 text-sm font-medium">Updating category: <span className="text-emerald-600 font-bold">{data?.category?.name}</span></p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <UpdateFormCategory
              categoryId={categoryId}
              category={data?.category ?? null}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Page;

const QUERY = `
query GetCategoryById($id: ID!) {
  category(id: $id) {
    created
    description
    id
    isActive
    modified
    name
  }
}
`;

type DataType = {
  category: Category;
};