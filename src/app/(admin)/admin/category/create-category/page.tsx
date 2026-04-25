"use client";

import BreadCrumbList from "@/components/shared/BreadCrumbList";
import CreateFormCategory from "./_components/CreateFormCategory";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const Page = () => {
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
              Create Category
            </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium ml-4 mt-1">
            Add a new category to organize your platform content.
          </p>
        </div>
      </div>

      <div className="mb-8 w-full">
        <BreadCrumbList
          breadCrumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Categories", href: "/admin/category" },
            { label: "Create Category", href: "/admin/category/create-category" },
          ]}
        />
      </div>

      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 bg-gray-50/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-50">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Category Details</h2>
              <p className="text-gray-500 text-sm font-medium">Fill in the information below to create a new category.</p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <CreateFormCategory />
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Page;