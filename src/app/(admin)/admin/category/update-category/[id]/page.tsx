"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import { useId } from "@/app/hooks/use-id";
import UpdateFormCategory from "./_components/UpdateFormCategory";
import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "@/lib/graphql-client";
import { Category } from "@/app/types";
import Loading from "@/app/loading";

const page = () => {
  const categoryId = useId();

  const { isFetching, data } = useQuery<DataType>({
    queryKey: ["CATEGORIES_KEY", categoryId],
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-black">Update Category</h1>
        </div>
      </div>

      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Category", href: "/admin/category" },
          { label: "Update Category", href: "/admin/category/update-category" },
        ]}
      />

      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-black">Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateFormCategory
            categoryId={categoryId}
            category={data?.category ?? null}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;

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