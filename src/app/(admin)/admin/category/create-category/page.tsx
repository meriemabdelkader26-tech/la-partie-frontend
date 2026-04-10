import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadCrumbList from "@/components/shared/BreadCrumbList";
import CreateFormCategory from "./_components/CreateFormCategory";

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-10 bg-linear-to-b from-emerald-400 to-emerald-600 rounded-full" />
          <h1 className="text-3xl font-semibold text-white">Create Category</h1>
        </div>
      </div>

      <BreadCrumbList
        breadCrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Category", href: "/admin/category" },
          { label: "Create Category", href: "/admin/category/create-category" },
        ]}
      />

      <Card className="bg-slate-900 border-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-white">Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateFormCategory />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;